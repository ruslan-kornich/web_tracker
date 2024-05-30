# WEB Tracker

**Task:**  
Create a web analytics tracker for advertising campaigns. The tracker should track clicks on advertising links and transitions to landing pages. 
It should also store information about the user who made the click or transition.

## Stack

**Backend:**
- Python 3.9+
- Django 3.2+
- Django REST Framework
- PostgreSQL

**Frontend:**
- React 17+

**Additional:**
- Docker
- Docker Compose

## Installation 

1. **Clone the repository:**

    ```bash
    git clone https://github.com/ruslan-kornich/web_tracker.git
    ```

2. **Create .env files in `/backend` and `/frontend` folders using the examples:**

    ```bash
    cd backend
    cp .env-example .env
    ```

    ```bash
    cd frontend
    cp .env-example .env
    ```

3. **Run Docker:**
   
   In the root folder `web_tracker`, run the compose file:

    ```bash
    docker-compose up --build
    ```

The main app will be available on the page http://0.0.0.0:3000

## Upload Data

After installation, you can either run the application yourself from scratch or install ready-made data:

1. **Customize from scratch:**

    ```bash
    docker exec -it web_tracker_backend_1 /bin/bash
    ```

    ```bash
    python manage.py createsuperuser
    ```

    Create your user.

After creating a user in the application you can go to the campaigns panel and create campaigns and offers from scratch 
in a clean application without data. 

2. **Download the prepared data:**

Test data and a test user will be created in the application, which will allow to see clearly the functionality of the application
After assembly of the docker containers run:

    ```bash
    docker exec -it web_tracker_backend_1 /bin/bash
    ```

    ```bash
    python manage.py loaddata data.json
    ```

    This will load the prepared data:

    Test user:

    - **Login:** admin
    - **Password:** admin

## Docs

Documentation will be available at pages:

- Swagger UI: [http://0.0.0.0:8000/swagger/](http://0.0.0.0:8000/swagger/)
- ReDoc: [http://0.0.0.0:8000/redoc/](http://0.0.0.0:8000/redoc/)
