// const calcTime =(timestamp)=>{
//     //한국시간 = UTC +9 -> 시간 계산 법 다름 -> 9시간 빼줘야함
//     const curTime = new Date().getTime()- 9*60*60*1000;
//     const time = new Date(curTime -timestamp);
//     const hour = time.getHours();
//     const minute = time.getMinutes();
//     const second = time.getSeconds();
    
//     if (hour>0) return `${hour>0}시간 전`;
//     else if (minute>0) return `${hour>0}분 전`;
//     else if (second>=0) return `${hour>0}초 전`;
//     else return '방금 전';
// }


const renderData= (data)=>{
    const items=document.querySelector('#items');
    
    data.reverse().forEach(async(obj)=>{
        const li = document.createElement('li');
        li.className= 'item';
        const itemImgColumn = document.createElement('div');
        itemImgColumn.className= 'item__column';

        const itemImg= document.createElement('img');
        const res = await fetch(`/images/${obj.id}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        itemImg.src= url;

        const itemTitle = document.createElement('div');
        itemTitle.className= 'item__title item__detail';
        itemTitle.innerText=obj.title;

        const itemPlace = document.createElement('div');
        itemPlace.className= 'item__state item__detail';
        itemPlace.innerText=obj.place;
        const itemInfo = document.createElement('div');
        itemInfo.className= 'item__state item__detail';
        itemInfo.innerText=obj.description;

        const itemPrice = document.createElement('div');
        itemPrice.className= 'item__price item__detail';
        itemPrice.innerText=obj.price;

        // const itemTime = document.createElement('div');
        // itemTime.className= 'item__state item__detail';
        // itemTitle.innerText=calcTime(obj.insertAt);

        const itemMainColumn = document.createElement('div');
        itemMainColumn.className= 'item__column';

        itemImgColumn.appendChild(itemImg);
        itemMainColumn.appendChild(itemTitle);
        itemMainColumn.appendChild(itemPlace);
        itemMainColumn.appendChild(itemInfo);
        itemMainColumn.appendChild(itemPrice);
        li.appendChild(itemImgColumn);
        li.appendChild(itemMainColumn);
        items.appendChild(li);
        
        

    });
};


const fetchList = async () =>{
    const res =await fetch('/items');
    const data = await res.json();
    console.log(data);
    renderData(data);
}

fetchList();