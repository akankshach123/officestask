'use client'
import {db} from './firebaseconfig';
import{collection, addDoc,getDocs,deleteDoc, serverTimestamp,query,orderBy,doc,updateDoc} from 'firebase/firestore';
import React,{useState,useEffect} from 'react';

async function addTodoToFirebase(title,details,dueDate){
  
  try{
    const docRef = await addDoc(collection(db,"todos"),{
      title:title,
      details:details,
      dueDate:dueDate,
      createdAt:serverTimestamp(),

    });
    console.log("Todo added with ID" ,docRef.id);
    return true;

  }catch(error){
    console.error("Error adding todo",error);
    return false;
  }
}

//funcation  to fetch todos from firestrore

async function fetchTodosFronFirestore(){
  const todoscollection = collection(db,"todos")
  const querySnapshot = await getDocs(query(todoscollection,orderBy("createdAt","desc")));
  const todos =[];
  querySnapshot.forEach((doc)=>{
    todos.push({ id: doc.id, ...doc.data() });
  });
  return todos;
}
//delete todos
async function deleteTofirebase(todoID){
  try{
    console.log("Attemptng to delete todo with Id" ,todoID);
    await deleteDoc(doc(db,"todos",todoID));
    return todoID;
  }catch(error){
    console.error("Error is deleting todo:",error);
    return null;
  }
}


export default function Home() {
  const [title,setTitle]= useState("");
  const [details,setDetails]= useState("");
  const [dueDate,setDueDate]= useState("");
 //state to hold the list to todos
 const [todos,setTodos]=useState([]);

 //
 const [selectedTodo , setSelectTodo]= useState(null);
 //
 const [isupdateMode ,setIsuodateMode]=useState(false);
 const handlesumbit = async(e)=>{
  e.preventDefault();
  if(isupdateMode){
    if(selectedTodo){
      try{
        const updatedTodo ={
          title,
          details,
          dueDate,
        };
        const todoRef=doc(db, "todos",selectedTodo.id);
        await updateDoc(todoRef,updatedTodo)

        //reset the from fields
        setTitle("");
        setDetails("");
        setDueDate("");
        setSelectTodo(null);
        setuodateMode(false);

        alert("Todo updated successfully!")
      }catch (error){
        console.log("Error updating todo",error)

      }
    }
  }else{
    const added = await addTodoToFirebase(title,details,dueDate);
    if(added){
      setTitle("");
      setDetails("");
      setDueDate("");
      alert("Todo added to firebase Suceesfully!!")
    }
  }
 };
 //fetch todos from firebae store
 useEffect(()=>{
  async function fetchTodos(){
    const todos = await fetchTodosFronFirestore();
    setTodos(todos);
  }
  fetchTodos();
 },[]);

 //funcation to handel "updated button click"
 const handelupdateclick=(todo)=>{
  setTitle(todo.title || "");
  setDetails(todo.details || "");
  setDueDate(todo.dueDate || "");
  
  setSelectTodo(todo);
  setIsuodateMode(true);
 }
  //featch todos from firessrore
  useEffect(()=>{
    async function fetchTodos(){
      const todos = await fetchTodosFronFirestore();
      setTodos(todos);
    }
    fetchTodos();

  },[]);
 
  return (
    <main className="flex flex-1 items-center justify-center flex-col md:flex-row min-h-screen">

      {/* left-section */}
      
      <section className='flex-1 flex md:flex-col items-center md:justify-start mx-auto'>
       {/* logo */}

       <div className='absolute top-1 left-4'>
        <img src ="https://static.vecteezy.com/system/resources/previews/000/963/090/original/cartoon-man-with-to-do-list-on-clipboard-vector.jpg" alt="Bug Ninga logo" width={75} height={75}/>
       
        
       </div>
       {/* Todo From */}
       
       <div className='p-6 md:p-12 mt-10 rounded-lg shadow-xl w-full max-w-lg bg-white'>
        <h2 className='text-center text-2xl font-bold leadng-9 text-gray-900'>
          {isupdateMode ? "update your Todo" : "create a Todo"}
        </h2>

        <form className='mt-6 space-y-6' onSubmit={handlesumbit}>
          <div>
            <label htmlFor='title' className='block text-sm font-medium leading-6 text-gray-600'>Title</label>
            <div className='mt-2'>
              <input 
              id="title"
              name='title'
              type='text'
              autoComplete='off'
              required
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              className='w-full rounded border py-2 pl-2 text-gray-900 shadow ring'/>
            </div>
          </div>

          <div>
            <label htmlFor='details' className='block text-sm font-medium leading-6 text-gray-600'>Details</label>
            <div className='mt-2'>
              <textarea
              id="details"
              name='details'
              rows="4"
              autoComplete='off'
              required
              value={details}
              onChange={(e)=>setDetails(e.target.value)}
              className='w-full rounded border py-2 pl-2 text-gray-900 shadow ring'></textarea>
            </div>
          </div>

          <div>
            <label htmlFor='dueDate' className='block text-sm font-medium leading-6 text-gray-600'>DueDate</label>
            <div className='mt-2'>
              <input 
              id="duedate"
              name='duedate'
              type='date'
              autoComplete='off'
              required
              value={dueDate}
              onChange={(e)=>setDueDate(e.target.value)}
              className='w-full rounded border py-2 pl-2 text-gray-900 shadow ring'/>
            </div>
          </div>
          <div>
            <button
            type='submit'
            className='w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-700'>{isupdateMode ? "update todo": "create Todo"}</button>
          </div>
        </form>
       </div>
    </section>

    {/* right section */}
    <h1 className=' absolute top-1 text-center text-3xl font-bold leading-15 text-white'><u>ToDo DashBord</u></h1>
    <section className='md:w-1/2 md:max-h-screen overflow-y-auto md:ml-10 mt-20 mx-auto'>
    {/* todolist */}
    <div className='p-6 md:p-12 mt-10 rounded-lg shadow-xl w-full max-w-lg bg-white'>
    <h2 className='text-center text-2xl font-blod leading-9 text-gray-900'>Todo List</h2>
    {/* todoitems */}

    <div className='mt-6 space-y-6'>
      {todos.map((todo)=>(
        <div key={todo.id} className='border p-4 rounded-md shadow-md'>
          <h3 className='text-lg font-semibload text-gery-900 break-words'>title:{todo.title}</h3>
            <p className='text-sm text-gray-500'>
              Due Date:{todo.dueDate}
            </p>
            <p className='text-gray-700 multiline break-words'>{todo.details}</p>
          <div className='mt-4 space-x-6'>
            <button
             type='button'
             className='px-3 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-md' onClick={()=>handelupdateclick(todo)}>update</button>
             <button
              type='button'
               onClick={async ()=>{
                const deletTodoId = await deleteTofirebase(todo.id)
                if(deletTodoId){
                  const updatedTodos = todos.filter((t)=>t.id!==deletTodoId);
                  setTodos(updatedTodos);
                }
               }}
               className='px-3 py-1 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md'
               >Delete</button>
             

          </div>


        </div>

      ))}

    </div>

    </div>

    </section>

      
     
    </main>
  )
}
