const zone = document.querySelectorAll(".container")

const form = document.querySelector("form")
const todo = document.getElementById("todo")
const main = document.querySelector(".main")

const checkel = document.getElementById("add")
const formel = document.querySelector(".d-form")
const btn = document.querySelector(".d-form")

const todoContainer = document.querySelector('.todo')
const progressContainer = document.querySelector('.progress')
const completedContainer = document.querySelector('.completed')

const LOCAL_STORAGE_KEY = 'kanbanboard.list'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

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
        const newtask = document.createElement('p')
        newtask.classList.add("draggable","to-do")
        newtask.setAttribute("draggable","true")
        newtask.id = list.id
        newtask.innerText=list.name

        newtask.addEventListener("dblclick",(e)=>{
            e.target.remove()
            lists = lists.filter(list => list.id != e.target.id)
            localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(lists))
        })

        newtask.addEventListener("dragstart",()=>{
            newtask.classList.add("dragging")
        })
        newtask.addEventListener("dragend",()=>{
            newtask.classList.remove("dragging")
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
    }s
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

renderlist()