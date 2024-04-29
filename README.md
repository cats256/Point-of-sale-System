# Database
1. psql -h csce-315-db.engr.tamu.edu -U csce315_902_03_user -d  csce315_902_03_db

# Frontend
1. cd frontend
2. npm install to install all required packages
3. npm install sass --save-dev
4. npm install @babel/plugin-proposal-private-property-in-object --save-dev
5. npm start
6. npm run format to format all files again for shared formatting

# Backend
1. pip install -r requirements.txt 
2. python server.py
3. pip freeze > requirements.txt to generate packages (needed for deployment)

# Backlog
https://docs.google.com/spreadsheets/d/1HpwlY0PQyUtm4bFJ6zUTv4BfW8pZNC4KwQ7-rJAEdFI/edit?usp=sharing 

# Formatting
- npm run format for formatting on all files
Install prettier, copy absolute path, to .prettierc, add that to prettier extension setting configuration path

# Scrum meeting times

* Sprint 3 Meeting Minutes
    * Planning meeting (4/16 12:00p - 12:15p)
        * Meeting Minutes
            * Agenda: Plans for Sprint 3
                * Last Meeting Follow-Up
                    * Need to clean up customer view functionality
                    * Finishing touches on manager view
                    * Cleaning everything up with styling
                * New Business
                    * Authentication API
    * Scrum 1 (4/18 12:00p - 12:15p)
        * Meeting Minutes
            * Agenda: Progress on Sprint 3
                * Last Meeting Follow-Up
                    * Finishing accessibility
                    * Authentication API
                * New Business
                    * Menu board needs to consist of many versions with a more comprehensive list of items on each version
                    * Manager view reports
    * Scrum 2 (4/23 12:00p - 12:15p)
        * Meeting Minutes
            * Agenda: Progress on Sprint 3
                * Last Meeting Follow-Up
                    * Manager view reports finished
                    * Authentication API
                    * Finishing accessibility
                * New Business
                    * Implementing NavBar across all pages
                    * Allowing employees data to be modified in Manager view
                    * Ordering ingredients inventory in manager restock
    * Scrum 3 (4/25 12:00p - 12:15p)
        * Meeting Minutes
            * Agenda: Seeing Progress on Spring 3
                * Last Meeting Follow-Up
                    * Implementing NavBar across all pages
                    * Allowing employees data to be modified in Manager view
                    * Ordering ingredients inventory in manager restock
                * New Business
                    * Implementing Kitchen View (tracking order processing)
    * Retrospective (4/27 12:00p - 12:30p)
        * Meeting Minutes
            * Agenda: Remaining Tasks for Sprint 3
                * Last Meeting Follow-Up
                    * NavBar is complete, need to apply to all pages
                    * Manager functionality is complete, need styling
                    * Authentication needs to be implemented
                    * Menu board needs styling
                    * Needs cohesive styling across the board
                    * Kitchen view backend complete
                * New Business
                    * Demoing in class to ensure functionality completeness
