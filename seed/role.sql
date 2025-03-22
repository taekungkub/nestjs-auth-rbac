-- สร้างตาราง users
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE
);

-- สร้างตาราง roles
CREATE TABLE roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- สร้างตาราง permissions
CREATE TABLE permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- สร้างตาราง role_permissions
CREATE TABLE role_permissions (
    role_id INTEGER,
    permission_id INTEGER,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

-- สร้างตาราง user_roles
CREATE TABLE user_roles (
    user_id INTEGER,
    role_id INTEGER,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- เพิ่มข้อมูลในตาราง users
INSERT INTO users (id, username) VALUES (1, 'alice');
INSERT INTO users (id, username) VALUES (2, 'bob');

-- เพิ่มข้อมูลในตาราง roles
INSERT INTO roles (id, name) VALUES (1, 'admin');
INSERT INTO roles (id, name) VALUES (2, 'user');
INSERT INTO roles (id, name) VALUES (3, 'guest');

-- เพิ่มข้อมูลในตาราง permissions
INSERT INTO permissions (id, name) VALUES (1, 'page:user');
INSERT INTO permissions (id, name) VALUES (2, 'create:user');
INSERT INTO permissions (id, name) VALUES (3, 'update:user');
INSERT INTO permissions (id, name) VALUES (4, 'delete:user');
INSERT INTO permissions (id, name) VALUES (5, 'export:data');
INSERT INTO permissions (id, name) VALUES (6, 'view:data');

-- เพิ่มข้อมูลในตาราง role_permissions
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 1);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 2);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 3);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 4);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 5);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 6);
INSERT INTO role_permissions (role_id, permission_id) VALUES (2, 5);
INSERT INTO role_permissions (role_id, permission_id) VALUES (2, 6);
INSERT INTO role_permissions (role_id, permission_id) VALUES (3, 6);

-- เพิ่มข้อมูลในตาราง user_roles
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);
INSERT INTO user_roles (user_id, role_id) VALUES (2, 2);

-- ดึงข้อมูลทั้งหมดจาก users
SELECT * FROM users;

-- ดึงข้อมูลทั้งหมดจาก roles
SELECT * FROM roles;

-- ดึงข้อมูลทั้งหมดจาก permissions
SELECT * FROM permissions;

-- ดึงข้อมูลทั้งหมดจาก role_permissions
SELECT * FROM role_permissions;

-- ดึงข้อมูลทั้งหมดจาก user_roles
SELECT * FROM user_roles;

-- ดูสิทธิ์ของแต่ละ role
SELECT roles.name AS role_name, permissions.name AS permission_name 
FROM role_permissions
JOIN roles ON role_permissions.role_id = roles.id
JOIN permissions ON role_permissions.permission_id = permissions.id;

-- ดู role ของแต่ละ user
SELECT users.username, roles.name AS role_name 
FROM user_roles
JOIN users ON user_roles.user_id = users.id
JOIN roles ON user_roles.role_id = roles.id;