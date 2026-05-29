import json
import urllib.error
import urllib.request
import uuid

BASE = "http://127.0.0.1:7000"

results = []


def req(method, path, data=None, token=None, expect=(200,)):
    url = BASE + path
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    payload = None
    if data is not None:
        payload = json.dumps(data).encode("utf-8")

    request = urllib.request.Request(url, data=payload, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=20) as resp:
            body = resp.read().decode("utf-8")
            code = resp.getcode()
    except urllib.error.HTTPError as error:
        code = error.code
        body = error.read().decode("utf-8", errors="ignore")

    return code in expect, code, body


def add(name, ok, code, body=""):
    results.append((name, ok, code, body[:200]))


ok, code, body = req("POST", "/auth/login", {"email": "ivan@mail.ru", "password": "ivan123"})
add("POST /auth/login", ok, code, body)
if not ok:
    print("TOTAL=1 FAIL=1")
    print(f"FAIL POST /auth/login :: {code} {body}")
    raise SystemExit(0)
admin_token = json.loads(body)["access_token"]

ok, code, body = req("POST", "/auth/login", {"email": "petr@mail.ru", "password": "petr123"})
add("POST /auth/login (user)", ok, code, body)
if not ok:
    print("TOTAL=2 FAIL=1")
    print(f"FAIL POST /auth/login (user) :: {code} {body}")
    raise SystemExit(0)
user_token = json.loads(body)["access_token"]

smoke_email = f"smk_{uuid.uuid4().hex[:8]}@mail.ru"
add("POST /auth/register", *req("POST", "/auth/register", {"email": smoke_email, "password": "smk12345", "first_name": "S"}))
add("GET /auth/me", *req("GET", "/auth/me", token=admin_token))
add("GET /auth/profile", *req("GET", "/auth/profile", token=admin_token))
add("PUT /auth/profile", *req("PUT", "/auth/profile", {"city": "C", "country": "R"}, admin_token))
add("GET /admin/users/", *req("GET", "/admin/users/", token=admin_token))

ok, code, body = req("GET", "/admin/users/", token=admin_token)
users = json.loads(body) if code == 200 else []
petr_user = next((u for u in users if u.get("email") == "petr@mail.ru"), None)
if petr_user:
    add(
        "PUT /admin/users/{user_id}/role",
        *req("PUT", f"/admin/users/{petr_user['id']}/role", {"role": "user"}, admin_token),
    )
else:
    results.append(("PUT /admin/users/{user_id}/role", False, 0, "target not found"))

add("GET /users/", *req("GET", "/users/", token=user_token))
add("GET /catalog/stamps", *req("GET", "/catalog/stamps", token=user_token))

ok, code, body = req("POST", "/catalog/stamps", {"name_code": "S", "country": "USSR", "year_issued": 1991}, admin_token)
add("POST /catalog/stamps", ok, code, body)
catalog_id = json.loads(body).get("id") if ok else None
if catalog_id:
    add("PUT /catalog/stamps/{stamp_id}", *req("PUT", f"/catalog/stamps/{catalog_id}", {"name_code": "S2"}, admin_token))
    add("DELETE /catalog/stamps/{stamp_id}", *req("DELETE", f"/catalog/stamps/{catalog_id}", token=admin_token))
else:
    results.append(("PUT /catalog/stamps/{stamp_id}", False, 0, "missing catalog id"))
    results.append(("DELETE /catalog/stamps/{stamp_id}", False, 0, "missing catalog id"))

add("GET /albums/", *req("GET", "/albums/", token=user_token))
ok, code, body = req("POST", "/albums/", {"title": "S Alb", "is_public": True}, user_token)
add("POST /albums/", ok, code, body)
album_id = json.loads(body).get("id") if ok else None
if album_id:
    add("PUT /albums/{album_id}", *req("PUT", f"/albums/{album_id}", {"title": "S Alb2", "is_public": False}, user_token))
    add("GET /albums/{album_id}/stamps", *req("GET", f"/albums/{album_id}/stamps", token=user_token))

    ok, code, body = req("GET", "/catalog/stamps", token=user_token)
    catalog_list = json.loads(body) if ok else []
    catalog_one_id = catalog_list[0]["id"] if catalog_list else None

    if catalog_one_id:
        ok2, code2, body2 = req(
            "POST",
            f"/albums/{album_id}/stamps",
            {"catalog_stamp_id": int(catalog_one_id), "custom_notes": "n"},
            user_token,
        )
        add("POST /albums/{album_id}/stamps", ok2, code2, body2)
        collection_id = json.loads(body2).get("id") if ok2 else None

        if collection_id:
            add(
                "PUT /albums/{album_id}/stamps/{stamp_id}",
                *req("PUT", f"/albums/{album_id}/stamps/{collection_id}", {"custom_notes": "u"}, user_token),
            )
            add(
                "DELETE /albums/{album_id}/stamps/{stamp_id}",
                *req("DELETE", f"/albums/{album_id}/stamps/{collection_id}", token=user_token),
            )
        else:
            results.append(("PUT /albums/{album_id}/stamps/{stamp_id}", False, 0, "missing collection id"))
            results.append(("DELETE /albums/{album_id}/stamps/{stamp_id}", False, 0, "missing collection id"))
    else:
        results.append(("POST /albums/{album_id}/stamps", False, 0, "no catalog stamps"))
        results.append(("PUT /albums/{album_id}/stamps/{stamp_id}", False, 0, "no catalog stamps"))
        results.append(("DELETE /albums/{album_id}/stamps/{stamp_id}", False, 0, "no catalog stamps"))

    add("DELETE /albums/{album_id}", *req("DELETE", f"/albums/{album_id}", token=user_token))
else:
    results.append(("PUT /albums/{album_id}", False, 0, "missing album id"))
    results.append(("GET /albums/{album_id}/stamps", False, 0, "missing album id"))
    results.append(("POST /albums/{album_id}/stamps", False, 0, "missing album id"))
    results.append(("PUT /albums/{album_id}/stamps/{stamp_id}", False, 0, "missing album id"))
    results.append(("DELETE /albums/{album_id}/stamps/{stamp_id}", False, 0, "missing album id"))
    results.append(("DELETE /albums/{album_id}", False, 0, "missing album id"))

add("GET /public/albums", *req("GET", "/public/albums"))
add("GET /categories/", *req("GET", "/categories/"))

ok, code, body = req("GET", "/admin/users/", token=admin_token)
users2 = json.loads(body) if ok else []
smoke_user = next((u for u in users2 if u.get("email") == smoke_email), None)
if smoke_user:
    add("DELETE /admin/users/{user_id}", *req("DELETE", f"/admin/users/{smoke_user['id']}", token=admin_token))
else:
    results.append(("DELETE /admin/users/{user_id}", False, 0, "smoke user not found"))

fails = [r for r in results if not r[1]]
print(f"TOTAL={len(results)} FAIL={len(fails)}")
for name, ok, code, body in fails:
    print(f"FAIL {name} :: {code} {body}")
