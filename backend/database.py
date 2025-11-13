import sqlite3
import json
from datetime import datetime
from typing import Dict, List, Optional
import os

class Database:
    def __init__(self, db_path: str = None):
        # Use /tmp for Vercel serverless (read-only filesystem except /tmp)
        if db_path is None:
            db_path = os.path.join(os.environ.get("TMPDIR", "/tmp"), "dhund.db")
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize database tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Missing persons table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS missing_persons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                age INTEGER NOT NULL,
                description TEXT,
                photo_path TEXT,
                reported_date TEXT,
                status TEXT DEFAULT 'missing',
                ai_analysis TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Citizen reports table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS citizen_reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                person_id INTEGER,
                location TEXT,
                description TEXT,
                reporter_phone TEXT,
                sighting_photo TEXT,
                verification_score REAL,
                report_time TEXT,
                status TEXT DEFAULT 'pending',
                FOREIGN KEY (person_id) REFERENCES missing_persons (id)
            )
        ''')
        
        # Search results table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS search_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                person_id INTEGER,
                camera_id TEXT,
                location TEXT,
                confidence REAL,
                timestamp TEXT,
                match_data TEXT,
                FOREIGN KEY (person_id) REFERENCES missing_persons (id)
            )
        ''')
        
        # Search status table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS search_status (
                person_id INTEGER PRIMARY KEY,
                status TEXT,
                last_updated TEXT,
                cameras_searched INTEGER DEFAULT 0,
                matches_found INTEGER DEFAULT 0,
                FOREIGN KEY (person_id) REFERENCES missing_persons (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def save_missing_person(self, person, ai_analysis: Dict) -> int:
        """Save missing person to database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO missing_persons 
            (name, age, description, photo_path, reported_date, ai_analysis)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            person.name,
            person.age,
            person.description,
            person.photo_path,
            person.reported_date.isoformat(),
            json.dumps(ai_analysis)
        ))
        
        person_id = cursor.lastrowid
        
        # Initialize search status
        cursor.execute('''
            INSERT INTO search_status (person_id, status, last_updated)
            VALUES (?, ?, ?)
        ''', (person_id, 'searching', datetime.now().isoformat()))
        
        conn.commit()
        conn.close()
        
        return person_id
    
    def get_missing_person(self, person_id: int) -> Optional[Dict]:
        """Get missing person by ID"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM missing_persons WHERE id = ?
        ''', (person_id,))
        
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return {
                'id': row[0],
                'name': row[1],
                'age': row[2],
                'description': row[3],
                'photo_path': row[4],
                'reported_date': row[5],
                'status': row[6],
                'ai_analysis': json.loads(row[7]) if row[7] else {}
            }
        
        return None
    
    def get_all_missing_persons(self) -> List[Dict]:
        """Get all missing persons"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, name, age, description, photo_path, reported_date, status 
            FROM missing_persons 
            ORDER BY reported_date DESC
        ''')
        
        rows = cursor.fetchall()
        conn.close()
        
        persons = []
        for row in rows:
            persons.append({
                'id': row[0],
                'name': row[1],
                'age': row[2],
                'description': row[3],
                'photo_path': row[4],
                'reported_date': row[5],
                'status': row[6]
            })
        
        return persons
    
    def save_citizen_report(self, report) -> int:
        """Save citizen report to database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO citizen_reports 
            (person_id, location, description, reporter_phone, sighting_photo, 
             verification_score, report_time)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            report.person_id,
            report.location,
            report.description,
            report.reporter_phone,
            report.sighting_photo,
            report.verification_score,
            report.report_time.isoformat()
        ))
        
        report_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return report_id
    
    def save_search_result(self, person_id: int, result: Dict):
        """Save search result to database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO search_results 
            (person_id, camera_id, location, confidence, timestamp, match_data)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            person_id,
            result.get('camera_id'),
            result.get('location'),
            result.get('confidence'),
            result.get('timestamp'),
            json.dumps(result)
        ))
        
        conn.commit()
        conn.close()
    
    def get_search_status(self, person_id: int) -> Dict:
        """Get current search status"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get search status
        cursor.execute('''
            SELECT * FROM search_status WHERE person_id = ?
        ''', (person_id,))
        
        status_row = cursor.fetchone()
        
        # Get recent reports
        cursor.execute('''
            SELECT COUNT(*) FROM citizen_reports WHERE person_id = ?
        ''', (person_id,))
        
        report_count = cursor.fetchone()[0]
        
        # Get search results
        cursor.execute('''
            SELECT COUNT(*) FROM search_results WHERE person_id = ?
        ''', (person_id,))
        
        result_count = cursor.fetchone()[0]
        
        conn.close()
        
        if status_row:
            return {
                'person_id': status_row[0],
                'status': status_row[1],
                'last_updated': status_row[2],
                'cameras_searched': status_row[3],
                'matches_found': status_row[4],
                'citizen_reports': report_count,
                'search_results': result_count
            }
        
        return {'status': 'not_found'}
    
    def update_match_status(self, person_id: int, match_result: Dict):
        """Update when a match is found"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Update missing person status
        cursor.execute('''
            UPDATE missing_persons 
            SET status = 'found' 
            WHERE id = ?
        ''', (person_id,))
        
        # Update search status
        cursor.execute('''
            UPDATE search_status 
            SET status = 'found', last_updated = ?, matches_found = matches_found + 1
            WHERE person_id = ?
        ''', (datetime.now().isoformat(), person_id))
        
        # Save the match result
        self.save_search_result(person_id, match_result)
        
        conn.commit()
        conn.close()
