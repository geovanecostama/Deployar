from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__)

# In-memory storage for tasks
tasks = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.json
    task = {
        'id': len(tasks) + 1,
        'title': data.get('title'),
        'description': data.get('description'),
        'completed': False,
        'created_at': datetime.now().isoformat()
    }
    tasks.append(task)
    return jsonify(task), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    for task in tasks:
        if task['id'] == task_id:
            data = request.json
            task['completed'] = data.get('completed', task['completed'])
            task['title'] = data.get('title', task['title'])
            return jsonify(task)
    return jsonify({'error': 'Task not found'}), 404

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    tasks = [task for task in tasks if task['id'] != task_id]
    return jsonify({'message': 'Task deleted'}), 200

if __name__ == '__main__':
    app.run(debug=False)
