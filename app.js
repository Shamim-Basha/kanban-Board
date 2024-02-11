const zone = document.querySelectorAll(".container")

const form = document.querySelector("form")
const todo = document.getElementById("todo")
const main = document.querySelector(".main")

const checkel = document.getElementById("add")
const formel = document.querySelector(".d-form")
const btn = document.querySelector(".d-form")
const dltall = document.querySelector(".dltAll")

const todoContainer = document.querySelector('.todo')
const progressContainer = document.querySelector('.progress')
const completedContainer = document.querySelector('.completed')

const LOCAL_STORAGE_KEY = 'kanbanboard.list'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

let pass = true

const sortbyorder = (a,b) => (a.order - b.order)
lists = lists.sort(sortbyorder)

function renderlist(){
    [todoContainer,progressContainer,completedContainer].map(container => 
        {
        while(container.firstChild){
            if(container.firstChild.classList[0] = 'draggable')
            container.removeChild(container.firstChild)
        }
    })
    
    lists.forEach(list => {
        const newtask = document.createElement('div')
        newtask.classList.add("draggable","to-do")
        newtask.setAttribute("draggable","true")
        newtask.id = list.id
        const p = document.createElement('p')
        p.innerText=list.name
        const dltbtn = document.createElement("button")
        dltbtn.classList.add("dltbtn")
        dltbtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ff0000" d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>`
        dltbtn.onclick = ()=>{
            newtask.remove()
            lists = lists.filter(list => list.id != newtask.id)
            localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(lists))
        }
        newtask.appendChild(p)
        newtask.appendChild(dltbtn)

        ////
        newtask.addEventListener("dragstart",()=>{
            newtask.classList.add("dragging")
        })
        newtask.addEventListener("touchstart",(e)=>{
            newtask.addEventListener("touchmove",()=>{
                newtask.classList.add("dragging")
                pass = true
            })
        })
        //
        newtask.addEventListener("dragend",()=>{
            newtask.classList.remove("dragging")
            if (!completedContainer.childElementCount){
                dltall.style.display = "none"
            }else{
                dltall.style.display = "block"
            }
        })
        newtask.addEventListener("touchend",()=>{
            newtask.classList.remove("dragging")
            pass = false
            if (!completedContainer.childElementCount){
                dltall.style.display = "none"
            }else{
                dltall.style.display = "block"
            }
        })
        if (list.container == 'todo'){
            todoContainer.appendChild(newtask)
        }else if(list.container == 'progress'){
            progressContainer.appendChild(newtask)
        }else{
            completedContainer.appendChild(newtask)
        }
})
}

function order(){
    [todoContainer,progressContainer,completedContainer].map(container => 
        {
        let i = 0
        container.querySelectorAll('.to-do').forEach(todo => {
            const item = lists.find(list => list.id === todo.id)
            item.order = i
            i++
        })
    })
    localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(lists))
}



formel.addEventListener("click",()=>{
    if (checkel.checked){
        form.style.display = "block"
        todo.setAttribute("autofocus","true")
        btn.style.transform = "rotate(45deg)"
        btn.style.color = "red"

    }else{
        form.style.display = "none"
        btn.style.transform = "rotate(0)"
        btn.style.color = "#2d2d2d"
    }
})


form.addEventListener("submit",(e)=>{
    e.preventDefault()
    if (!todo.value)return;
    lists.push({id:Date.now().toString(),name:todo.value,container:'todo',order:0})
    localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(lists))
    todo.value = ''
    renderlist()
    order()
})

///
zone.forEach(zone=>{
    zone.addEventListener("dragover",(e)=>{
        e.preventDefault()
        const zones = zone.querySelector('.zone')
        const afterel= dragafterel(zones,e.clientY)
        const dragging = document.querySelector(".dragging")
        if (afterel == null){
            zones.appendChild(dragging)
        }else{
            zones.insertBefore(dragging,afterel)
        }
        const selectedlist = lists.find(list =>list.id === dragging.id )
        selectedlist.container = zones.classList[0]
        order()
        localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(lists))
    })
})

function findZoneAtCoordinates(x, y) {
    for (const z of zone) {
        const rect = z.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            return z;
        }
    }
    return null;
}

document.addEventListener("touchstart",()=>{
    pass = false
})
document.addEventListener("touchmove",e=>{
    if(!pass){
        return
    }
    e.preventDefault()
    const zones = findZoneAtCoordinates(e.touches[0].clientX,e.touches[0].clientY)?.querySelector(".zone")
    if (!zones ){
        return
    }
    const afterel= dragafterel(zones,e.touches[0].clientY)
    const dragging = document.querySelector(".dragging")
    // console.log(afterel.id)
    if (!afterel){
        zones.appendChild(dragging)
    }else{
        try{
            zones.insertBefore(dragging,afterel)
        }catch{
            
        }
    }
    const selectedlist = lists.find(list =>list.id === dragging.id )
    selectedlist.container = zones.classList[0]
    order()
    localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(lists))
},{passive:!pass})
//////

function dragafterel(container,y){
    const draggableel = [...container.querySelectorAll(".to-do:not(.dragging)")]
    return draggableel.reduce((closest,child)=>{
        const box =child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset){
            return { offset : offset, Element : child }
        }else{
            return closest
        }
    },{ offset : Number.NEGATIVE_INFINITY}).Element
}

dltall.onclick = ()=>{
    while(completedContainer.firstChild){
        if(completedContainer.firstChild.classList[0] = 'draggable')
        completedContainer.removeChild(completedContainer.firstChild)
    }
    dltall.style.display = "none"
    lists = lists.filter(list => list.container != "completed")
    localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(lists))
}

renderlist()
if (!completedContainer.childElementCount){
    dltall.style.display = "none"
}