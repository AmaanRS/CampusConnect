# Enviornment variables

## Backend env structure

```bash
PORT = 8000
JWT_SECRET = 123
ORIGIN = http://localhost:5173/
ENV = DEV
REPL_SET = rs0Me

REMOTE_MONGO_URI = mongodb+srv://<atlas_username>:<db_password>@cluster0.ni6jd9k.mongodb.net/CampusConnectSelf?retryWrites=true&w=majority&appName=Cluster0

LOCAL_MONGO_URI = mongodb://localhost:27017/CampusConnectSelf

LOCAL_TEST_MONGO_URI = mongodb://localhost:27017/TestDbCampusConnectSelf
```

!!! If you set ENV = DEV in .env file then, local mongodb db and dev server will be used

!!! If you set ENV = PROD in .env then, atlas mongodb db will be used

# Setting up a replication set in ubuntu

#### Replication set is necessary because the code uses transaction if you are in DEV enviornment (i.e ENV = DEV)

# Installation

You should already have mongodb installed locally

### Open the MongoDB configuration file on your machine for editing:

```bash
sudo nano /etc/mongod.conf
```

### Modify the following lines in the configuration file:

```bash
replication:
  replSetName: "rs0Me"
```

!!! You have to use this name in .env file '**REPL_SET**'

### Restart mongodb

```bash
sudo systemctl restart mongod
```

### In windows run the following command in command prompt

```bash
Did not find a fully working method
```

# APIs

## General

```
/getAllPendingCommittees
/actionOnPendingCommittee
```

## User

```
/user/login
/user/signup
/user/getUserProfileStatus
```

## Admin

```
/admin/createAdmin
/admin/getAdmin
/admin/updateAdmin
/admin/deleteAdmin
/admin/deleteUserByEmail
```

## Committee

```
/committee/createCommittee
/committee/getCommittee
/committee/updateCommittee
/committee/deleteCommittee
```

## Event (Is not tested yet)

```
/event/createEvent
/event/getEvent
/event/updateEvent
/event/deleteEvent
```

## Student

```
/student/createStudent
/student/getStudent
/student/updateStudent
/student/deleteStudent
```

## Teacher

```
/teacher/createTeacher
/teacher/getTeacher
/teacher/updateTeacher
/teacher/deleteTeacher
```

# TODO - A task left to do

# TODO NOW - A task on high priority or a task to be done immediately

# TEST NOW - Perform testing on high priority or testing to be done immediately

# Every model will use mongodb ObjectId internally and nanoid when showing results to user (ie externally)

# Unique id start with a prefix eg for committee id it starts with C, for event id it starts with E and so on

# All the data of a deleted committee will be saved but it can only be seen by admin

# A studentIncharge is automatically (programatically) set as a member of the committee

# A facultyIncharge is automatically (programatically) set in facultyTeam of the committee

# Features to add

1. When some puts social media link(instagram,facebook,youtube) in post it should open up as a popup and not redirect it to the social media website

2. Make a section where promotions of companies can be inserted during an event by a committee

