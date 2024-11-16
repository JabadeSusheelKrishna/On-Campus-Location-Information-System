from flask import Flask, request, jsonify, render_template, redirect
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Path to store events
EVENTS_FILE = 'events.json'

# Function to read the events from the events.json file
def read_events():
    if os.path.exists(EVENTS_FILE):
        with open(EVENTS_FILE, 'r') as file:
            return json.load(file)
    return []

# Function to save events to the events.json file
def save_event(event_data):
    events = read_events()
    events.append(event_data)
    with open(EVENTS_FILE, 'w') as file:
        json.dump(events, file, indent=4)

# Function to filter upcoming events (events after current time)
def get_upcoming_events():
    events = read_events()
    upcoming_events = []
    
    # Get current date and time
    now = datetime.now()
    
    # Filter events that have time greater than current time
    for event in events:
        event_datetime_str = f"{event['date']} {event['time']}"
        event_datetime = datetime.strptime(event_datetime_str, '%Y-%m-%d %H:%M')
        
        if event_datetime > now:
            upcoming_events.append(event)
    
    # Sort the events by datetime (ascending order)
    upcoming_events.sort(key=lambda e: f"{e['date']} {e['time']}")
    
    # Return the latest 3 upcoming events
    return upcoming_events[:3]

@app.route('/events', methods=['POST'])
def handle_event():
    # Get the JSON data from the request
    event_data = request.get_json()
    
    # Save the event data to the events.json file
    save_event(event_data)
    
    # Print the event data to the console (optional)
    # print('Received Event:', event_data)
    
    # Send a success response
    return 'Success', 200

@app.route('/events', methods=['GET'])
def get_events():
    # Get the upcoming events
    upcoming_events = get_upcoming_events()
    print(upcoming_events)
    
    # Return the upcoming events as a JSON response
    return jsonify(upcoming_events), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3200)
