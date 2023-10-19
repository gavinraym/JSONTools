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

def process_project(filename, course_filename):

    uuid_dict = dict()

    with open(filename, 'r') as file:
        project_data = file.read()
        
    project_json = json.loads(project_data)

    record_all_uuid(project_json, uuid_dict)
    project_data = replace_all_uuid(project_data, uuid_dict)

    with open(filename, 'w') as file:
        file.write(project_data)

    with open(course_filename, 'r') as file:
        course_data = file.read()
    
    course_data = replace_all_uuid(course_data, uuid_dict)

    with open(course_filename, 'w') as file:
        file.write(course_data)
    


if __name__ == '__main__':
    #If this file is in the root dir, add course name here and run. It will change
    #all UUIDs. UUIDs that are matching will continue to match.
    course_to_change = 'AddCourseNameHere'


    course_directory = f'{course_to_change}/course.json'
    project_directory = f'{course_to_change}/projects'  # Change this to the path of your parent directory

    for dirpath, dirnames, filenames in os.walk(project_directory):
        for filename in filenames:
            if filename == 'project.json':
                process_project( os.path.join(dirpath, filename), course_directory )
                print("Finished parsing ", course_directory + dirpath + filename)



    

   
