import os
import json
import uuid

def generate_random_uuid():
    return str(uuid.uuid4())

def is_valid_uuid(uuid_str):
    try:
        uuid.UUID(uuid_str, version=4)
        return True
    except ValueError:
        return False

def record_all_uuid(data, uid_dict):
    if isinstance(data, dict):
        for key, value in data.items():
            if key == 'id':
                if is_valid_uuid(value):
                    uid_dict[value] = generate_random_uuid()
            elif isinstance(value, (dict, list)):
                record_all_uuid(value, uid_dict)
    elif isinstance(data, list):
        for item in data:
            record_all_uuid(item, uid_dict)

def replace_all_uuid(file, uid_dict):
    for old_uuid, new_uuid in uid_dict.items():
        file = file.replace(old_uuid, new_uuid)
    return file

def process_project(filename):

    uuid_dict = dict()

    with open(filename, 'r') as file:
        project_data = file.read()
        
    project_json = json.loads(project_data)

    record_all_uuid(project_json, uuid_dict)
    project_data = replace_all_uuid(project_data, uuid_dict)

    with open(filename, 'w') as file:
        file.write(project_data)

if __name__ == '__main__':
    #Add the full path of the file that should be changed and run. It will change
    #all UUIDs. UUIDs that are matching will continue to match.
    file_to_change = "project.json"

    process_project( file_to_change )



    

   