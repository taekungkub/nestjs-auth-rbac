users
+----+------------+
| id | username   |
+----+------------+
|  1 | alice      |
|  2 | bob        |
+----+------------+

roles
+----+--------+
| id | name   |
+----+--------+
|  1 | admin  |
|  2 | user   |
|  3 | guest  |
+----+--------+

permissions
+----+--------------+
| id | name         |
+----+--------------+
|  1 | page:user    |
|  2 | create:user  |
|  3 | update:user  |
|  4 | delete:user  |
|  5 | export:data  |
|  6 | view:data    |
+----+--------------+

role_permissions (Mapping Table)
+---------+---------------+
| role_id | permission_id |
+---------+---------------+
|       1 |             1 | (admin → page:user)
|       1 |             2 | (admin → create:user)
|       1 |             3 | (admin → update:user)
|       1 |             4 | (admin → delete:user)
|       1 |             5 | (admin → export:data)
|       1 |             6 | (admin → view:data)
|       2 |             5 | (user → export:data)
|       2 |             6 | (user → view:data)
|       3 |             6 | (guest → view:data)
+---------+---------------+

user_roles (Mapping Table)
+---------+---------+
| user_id | role_id |
+---------+---------+
|       1 |       1 | (alice → admin)
|       2 |       2 | (bob → user)
+---------+---------+
