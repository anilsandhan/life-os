import React, { useState } from 'react'
import { AREAS, AREA_COLOR, AREA_ICON, PRIO_COLOR } from '../constants'
import { TaskCard } from './TaskCard'

let _nid = 400

function AddSheet({ onAdd, onClose }) {
  const [title,setTitle]=useState('')
  const [area,setArea]=useState('Work')
  const [prio,setPrio]=useState('medium')
  const [due,setDue]=useState('')
  const [note,setNote]=useState('')
  const [recur,setRecur]=useState('')

  const Field = ({label,children}) => (
    <div>
      <div style={{fontFamily:'var(--font-mono)',fontSize:8,color:'var(--subtle)',letterSpacing:3,marginBottom:5}}>{label}</div>
      {children}
    </div>
  )
  const inputSt = {width:'100%',background:'var(--elevated)',border:'1px solid var(--rim2)',borderRadius:8,padding:'10px 12px',color:'var(--text)',fontSize:13,outline:'none'}
  const selSt   = {...inputSt,cursor:'pointer'}

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',zIndex:8000,display:'flex',alignItems:'flex-end'}}>
      <div className="slide-up" style={{
        width:'100%',maxWidth:540,margin:'0 auto',
        background:'var(--surface)',borderTop:'1px solid var(--rim2)',
        borderRadius:'24px 24px 0 0',
        padding:'0 18px 0',paddingBottom:'calc(20px + env(safe-area-inset-bottom,0px))',
      }}>
        {/* Handle */}
        <div style={{display:'flex',justifyContent:'center',padding:'14px 0 18px'}}>
          <div style={{width:36,height:3,background:'var(--rim2)',borderRadius:2}}/>
        </div>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:18}}>
          <div style={{fontFamily:'var(--font-display)',fontSize:24,letterSpacing:3,color:'var(--bright)'}}>NEW TASK</div>
          <button onClick={onClose} style={{color:'var(--muted)',fontSize:20}}>✕</button>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:12,maxHeight:'60vh',overflowY:'auto'}}>
          <Field label="MISSION">
            <input autoFocus placeholder="What needs to be done?" value={title} onChange={e=>setTitle(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&title.trim()&&onAdd({title:title.trim(),area,priority:prio,dueDate:due||null,note,recurring:recur||null})}
              style={{...inputSt,fontSize:15,fontWeight:500}}/>
          </Field>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <Field label="DOMAIN">
              <select value={area} onChange={e=>setArea(e.target.value)} style={selSt}>
                {['Work','Property','Family','Home','Health','Finance','Other'].map(a=><option key={a}>{a}</option>)}
              </select>
            </Field>
            <Field label="PRIORITY">
              <select value={prio} onChange={e=>setPrio(e.target.value)} style={selSt}>
                <option value="high">● CRITICAL</option>
                <option value="medium">● NORMAL</option>
                <option value="low">● LOW</option>
              </select>
            </Field>
            <Field label="DEADLINE">
              <input type="date" value={due} onChange={e=>setDue(e.target.value)} style={{...inputSt,color:due?'var(--text)':'var(--muted)'}}/>
            </Field>
            <Field label="RECURRENCE">
              <select value={recur} onChange={e=>setRecur(e.target.value)} style={selSt}>
                <option value="">One-time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </Field>
          </div>

          <Field label="NOTES / CONTEXT">
            <textarea placeholder="Links, context, dependencies…" value={note} onChange={e=>setNote(e.target.value)} rows={2}
              style={{...inputSt,lineHeight:1.6}}/>
          </Field>
        </div>

        <button
          onClick={()=>title.trim()&&onAdd({title:title.trim(),area,priority:prio,dueDate:due||null,note,recurring:recur||null})}
          disabled={!title.trim()}
          style={{
            width:'100%',marginTop:16,padding:'15px',
            background:title.trim()?'var(--signal)':'var(--elevated)',
            border:'none',borderRadius:12,
            color:title.trim()?'var(--deep)':'var(--muted)',
            fontFamily:'var(--font-display)',fontSize:18,letterSpacing:4,
            transition:'all .2s',
          }}>
          ADD TO OPS
        </button>
      </div>
    </div>
  )
}

function DateModal({ task, onSave, onClose }) {
  const [val,setVal]=useState('')
  const min=new Date(Date.now()+60000).toISOString().slice(0,16)
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.8)',zIndex:9000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div className="slide-up" style={{background:'var(--surface)',border:'1px solid var(--rim2)',borderRadius:20,padding:24,width:'100%',maxWidth:340}}>
        <div style={{fontFamily:'var(--font-display)',fontSize:22,letterSpacing:3,color:'var(--bright)',marginBottom:6}}>SET ALERT</div>
        <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--subtle)',marginBottom:16,lineHeight:1.5}}>{task.title}</div>
        <input type="datetime-local" min={min} value={val} onChange={e=>setVal(e.target.value)}
          style={{width:'100%',background:'var(--elevated)',border:'1px solid var(--rim2)',borderRadius:10,padding:'12px',color:'var(--text)',fontSize:13,marginBottom:14,outline:'none'}}/>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>val&&onSave(new Date(val).getTime())} disabled={!val}
            style={{flex:1,padding:13,background:val?'var(--signal)':'var(--elevated)',border:'none',borderRadius:10,color:val?'var(--deep)':'var(--muted)',fontFamily:'var(--font-display)',fontSize:16,letterSpacing:3}}>
            CONFIRM
          </button>
          <button onClick={onClose} style={{padding:'13px 16px',background:'transparent',border:'1px solid var(--rim)',borderRadius:10,color:'var(--dim)',fontSize:16}}>✕</button>
        </div>
      </div>
    </div>
  )
}

export function TasksTab({ tasks, setTasks, schedule, cancel, addToast }) {
  const [filter,setFilter]=useState('All')
  const [search,setSearch]=useState('')
  const [showAdd,setShowAdd]=useState(false)
  const [dateModal,setDateModal]=useState(null)

  const toggleTask = id => setTasks(t=>t.map(x=>{
    if(x.id!==id)return x
    if(!x.done&&x.recurring) addToast('RECURRING',`Will reset ${x.recurring}ly`,'↺','var(--accent)')
    return{...x,done:!x.done}
  }))
  const deleteTask = id => { cancel(id); setTasks(t=>t.filter(x=>x.id!==id)) }

  function addTask(data) {
    setTasks(p=>[{id:_nid++,...data,done:false,ts:Date.now(),notifyAt:null},...p])
    setShowAdd(false)
    addToast('TASK ADDED',data.title.slice(0,40)+'…','✦','var(--signal)')
  }

  function setNotifyAt(taskId,ts) {
    setTasks(t=>t.map(x=>x.id===taskId?{...x,notifyAt:ts}:x))
    const task=tasks.find(x=>x.id===taskId)
    if(task){schedule({...task,notifyAt:ts},ts-Date.now());addToast('ALERT SET',new Date(ts).toLocaleString([],{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}),'⏰','var(--signal)')}
    setDateModal(null)
  }

  const counts = {}
  tasks.filter(t=>!t.done).forEach(t=>{counts[t.area]=(counts[t.area]||0)+1})

  let visible = tasks.filter(t=>(filter==='All'||t.area===filter)&&(!search||t.title.toLowerCase().includes(search.toLowerCase())))
  const open   = [...visible.filter(t=>!t.done)].sort((a,b)=>({high:0,medium:1,low:2}[a.priority]-{high:0,medium:1,low:2}[b.priority]||b.ts-a.ts))
  const closed = [...visible.filter(t=>t.done)].sort((a,b)=>b.ts-a.ts)

  return (
    <>
      {showAdd   && <AddSheet onAdd={addTask} onClose={()=>setShowAdd(false)}/>}
      {dateModal && <DateModal task={dateModal} onSave={ts=>setNotifyAt(dateModal.id,ts)} onClose={()=>setDateModal(null)}/>}

      {/* Search */}
      <div style={{padding:'10px 14px 6px',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:8,background:'var(--surface)',border:'1px solid var(--rim)',borderRadius:10,padding:'10px 13px'}}>
          <span style={{color:'var(--muted)',fontSize:14,fontFamily:'var(--font-display)',letterSpacing:1}}>⌕</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search operations…"
            style={{flex:1,fontSize:13,fontWeight:400,outline:'none'}}/>
          {search&&<button onClick={()=>setSearch('')} style={{color:'var(--muted)',fontSize:13}}>✕</button>}
        </div>
      </div>

      {/* Domain filter */}
      <div style={{display:'flex',gap:5,padding:'6px 14px 8px',overflowX:'auto',scrollbarWidth:'none',flexShrink:0}}>
        {AREAS.map(a=>{
          const c=a==='All'?'var(--signal)':(AREA_COLOR[a]||'var(--dim)')
          const cnt=a==='All'?tasks.filter(t=>!t.done).length:(counts[a]||0)
          const active=filter===a
          return(
            <button key={a} onClick={()=>setFilter(a)} style={{
              padding:'5px 12px',borderRadius:20,fontSize:10,
              fontFamily:'var(--font-mono)',letterSpacing:1,
              border:`1px solid ${active?c:c+'30'}`,
              background:active?`${c}15`:'transparent',
              color:active?c:'var(--muted)',
              whiteSpace:'nowrap',transition:'all .2s',
            }}>
              {a==='All'?'ALL':`${AREA_ICON[a]} ${a.toUpperCase()}`}{cnt>0?` · ${cnt}`:''}
            </button>
          )
        })}
      </div>

      {/* Add button */}
      <div style={{padding:'0 14px 8px',flexShrink:0}}>
        <button onClick={()=>setShowAdd(true)} style={{
          width:'100%',padding:'13px',background:'transparent',
          border:'1px dashed var(--rim2)',borderRadius:12,
          color:'var(--muted)',fontFamily:'var(--font-display)',
          fontSize:16,letterSpacing:4,transition:'all .2s',
          display:'flex',alignItems:'center',justifyContent:'center',gap:10,
        }}>
          <span style={{fontSize:20,lineHeight:1}}>+</span>NEW OPERATION
        </button>
      </div>

      {/* Task list */}
      <div style={{flex:1,overflowY:'auto',paddingBottom:'calc(var(--nav-h) + 12px)'}}>
        {open.length>0&&<>
          <SLabel text="ACTIVE OPS" count={open.length} color="var(--signal)"/>
          {open.map((t,i)=>(
            <TaskCard key={t.id} task={t} idx={i}
              onToggle={()=>toggleTask(t.id)}
              onDelete={()=>deleteTask(t.id)}
              onSetNotify={ts=>setNotifyAt(t.id,ts)}
              onClearNotify={()=>{cancel(t.id);setTasks(p=>p.map(x=>x.id===t.id?{...x,notifyAt:null}:x))}}
              onOpenDateModal={()=>setDateModal(t)}
              onUpdateNote={v=>setTasks(p=>p.map(x=>x.id===t.id?{...x,note:v}:x))}
            />
          ))}
        </>}

        {closed.length>0&&<>
          <SLabel text="CLOSED" count={closed.length} color="var(--success)"/>
          {closed.map(t=>(
            <div key={t.id} style={{padding:'0 14px 6px',opacity:.35}}>
              <div style={{padding:'10px 14px',background:'var(--deep)',border:'1px solid var(--rim)',borderRadius:10,display:'flex',gap:10,alignItems:'center'}}>
                <div onClick={()=>toggleTask(t.id)}
                  style={{width:20,height:20,borderRadius:4,background:'var(--success)',border:'2px solid var(--success)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0}}>
                  <span style={{fontSize:10,color:'var(--deep)',fontWeight:700}}>✓</span>
                </div>
                <div style={{flex:1,fontFamily:'var(--font-ui)',fontSize:13,color:'var(--muted)',textDecoration:'line-through'}}>{t.title}</div>
                <button onClick={()=>deleteTask(t.id)} style={{color:'var(--muted)',fontSize:13}}>✕</button>
              </div>
            </div>
          ))}
        </>}

        {open.length===0&&closed.length===0&&(
          <div style={{textAlign:'center',padding:'60px 20px'}}>
            <div style={{fontFamily:'var(--font-display)',fontSize:40,letterSpacing:6,color:'var(--rim)',marginBottom:8}}>CLEAR</div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--muted)',letterSpacing:3}}>
              {search?`NO RESULTS FOR "${search.toUpperCase()}"` :'ALL OPERATIONS CLOSED'}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function SLabel({text,count,color}){
  return(
    <div style={{padding:'10px 14px 7px',display:'flex',alignItems:'center',gap:8}}>
      <span style={{fontFamily:'var(--font-mono)',fontSize:8,letterSpacing:4,color:'var(--muted)'}}>{text}</span>
      <div style={{height:'1px',flex:1,background:`linear-gradient(90deg,${color}40,transparent)`}}/>
      <span style={{fontFamily:'var(--font-mono)',fontSize:9,color,background:`${color}15`,border:`1px solid ${color}30`,borderRadius:3,padding:'1px 8px'}}>{count}</span>
    </div>
  )
}
