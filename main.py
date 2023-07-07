from fastapi import FastAPI,UploadFile,Form,Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
#백엔드 서버가 프론트엔드를 서빙하려면
from fastapi.staticfiles import StaticFiles
from typing import Annotated
import sqlite3

con =sqlite3.connect('db.db',check_same_thread=False)
cur=con.cursor()

cur.execute(f"""
            CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
	image BLOB,
	price INTEGER NOT NULL,
	description TEXT,
	place TEXT NOT NULL
            );
            """)

app = FastAPI()

@app.post('/items')
async def create_item(image:UploadFile,
                title:Annotated[str,Form()],
                price:Annotated[int,Form()],
                description:Annotated[str,Form()],
                place:Annotated[str,Form()]):
    
    image_bytes= await image.read()
    #""""""-> javascript에서의 `${}`느낌
    #SQL문
    cur.execute(f"""
                INSERT INTO items(title,image,price,description,place)
                VALUES ('{title}','{image_bytes.hex()}',{price},'{description}','{place}')
                """)
    con.commit()
    return '200';

@app.get('/items')
async def get_items():
    #컬럼명도 같이 가져옴
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    rows = cur.execute(f"""
                       SELECT * from items;
                    """).fetchall()
    return JSONResponse(jsonable_encoder(dict(row) for row in rows))



@app.get('/images/{item_id}')
async def get_image(item_id):
    cur = con.cursor()
    image_bytes = cur.execute(f"""
                            SELECT image from items WHERE id ={item_id}
                            """).fetchone()[0]
    
    return Response(content=bytes.fromhex(image_bytes),media_type='image/*')


#html=True를 붙이면 ~~.html 안 붙어도됨
#api를 만들때 항상 이문장보다 위에작성-> 밑에 코드 작성 안됨
app.mount('/',StaticFiles(directory='static',html=True),name='static')

