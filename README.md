# Drello
Trello on Django
(Just played around with Django Channels & React)

## To install and run:
```bash
cd drello
pip install -r requirements.txt
touch db.sqlite3
./manage.py migrate
./manage.py createsuperuser
./manage.py runserver

# proceed to http://localhost:8000/admin/ to add Statuses to Trello board
# see em rolling on http://localhost:8000/
```
![Drello](https://raw.githubusercontent.com/yanlobkarev/drello/master/static/images/screenshot.png)
