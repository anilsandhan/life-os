import React, { useState, useRef } from 'react'
import { AREA_COLOR, AREA_ICON, PRIO_COLOR, PRIO_LABEL } from '../constants'

// Confetti burst on task completion
function burst(x, y) {
  const colors = ['#e8a020','#40c080','#4090e0','#c060e0','#e05050']
  for (let i = 0; i < 10; i++) {
    const el = document.createElement('div')
    const color = colors[i % colors.length]
    const size = Math.random()*5+3
    el.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;width:${size}px;height:${size}px;
      background:${color};border-radius:${Math.random()>.5?'50%':'2px'};
      pointer-events:none;z-index:9999;
      animation:confettiFall ${.5+Math.random()*.5}s ease both;
      transform:translateX(${(Math.random()-.5)*60}px);
    `
    document.body.appendChild(el)
    setTimeout(()=>el.remove(), 1200)
  }
}

export function TaskCard({ task, onToggle, onDelete, onSetNotify, onClearNotify, onOpenDateModal, onUpdateNote, idx=0 }) {
  const [expanded, setExpanded] = useState(false)
  const [noteMode, setNoteMode] = useState(false)
  const [noteVal, setNoteVal]   = useState(task.note||'')
  const [completing, setCompleting] = useState(false)
  const touchX = useRef(null)
  const [swipeDx, setSwipeDx]  = useState(0)
  const hasNotify = task.notifyAt && task.notifyAt > Date.now()
  const ac = AREA_COLOR[task.area] || 'var(--c-other)'
  const pc = PRIO_COLOR[task.priority]

  const dueInfo = task.dueDate ? (()=>{
    const diff = Math.ceil((new Date(task.dueDate)-new Date())/86400000)
    if (diff<0)  return {label:`${Math.abs(diff)}d OVERDUE`, color:'var(--critical)'}
    if (diff===0)return {label:'DUE TODAY',  color:'var(--signal)'}
    if (diff<=3) return {label:`${diff}d LEFT`, color:'var(--signal)'}
    return {label:`${diff}d`, color:'var(--subtle)'}
  })():null

  function handleComplete(e) {
    if (task.done) { onToggle(); return }
    setCompleting(true)
    burst(e.clientX||160, e.clientY||300)
    setTimeout(()=>{ setCompleting(false); onToggle() }, 380)
  }

  // Swipe to complete
  const onTS = e => { touchX.current = e.touches[0].clientX }
  const onTM = e => { if(touchX.current===null)return; const dx=e.touches[0].clientX-touchX.current; if(dx>0)setSwipeDx(Math.min(dx,90)) }
  const onTE = e => { if(swipeDx>60) handleComplete({clientX:160,clientY:300}); setSwipeDx(0); touchX.current=null }

  return (
    <div className={`fade-up${completing?' task-completing':''}`}
      style={{animationDelay:`${idx*.05}s`,padding:'0 14px 8px',position:'relative'}}>

      {/* Swipe hint bg */}
      {swipeDx>10 && (
        <div style={{
          position:'absolute',left:14,right:14,top:0,bottom:8,
          background:'var(--success)',borderRadius:'var(--radius)',
          opacity:swipeDx/90*0.15,display:'flex',alignItems:'center',paddingLeft:20,
          transition:'opacity .1s',
        }}>
          <span style={{fontFamily:'var(--font-display)',fontSize:20,letterSpacing:3,color:'var(--success)'}}>DONE</span>
        </div>
      )}

      <div onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE}
        style={{transform:`translateX(${swipeDx}px)`,transition:swipeDx>0?'none':'transform .2s ease'}}>
        <div style={{
          background: task.done ? 'var(--deep)' : 'var(--surface)',
          border:`1px solid ${task.done?'var(--rim)':ac+'30'}`,
          borderLeft:`2px solid ${task.done?'var(--rim)':ac}`,
          borderRadius:'var(--radius)',overflow:'hidden',
          boxShadow: task.done?'none':`0 4px 20px ${ac}08`,
          transition:'all .3s ease',
          opacity: task.done ? 0.45 : 1,
        }}>
          {/* Main row */}
          <div style={{padding:'14px 14px 12px',display:'flex',gap:12,alignItems:'flex-start'}}
            onClick={()=>!noteMode&&setExpanded(v=>!v)}>

            {/* Checkbox */}
            <div onClick={e=>{e.stopPropagation();handleComplete(e)}}
              style={{
                width:22,height:22,borderRadius:5,flexShrink:0,marginTop:1,
                border:`2px solid ${task.done?'var(--success)':pc}`,
                background:task.done?'var(--success)':'transparent',
                display:'flex',alignItems:'center',justifyContent:'center',
                cursor:'pointer',transition:'all .2s',
              }}>
              {task.done && <span style={{fontSize:11,color:'var(--deep)',fontWeight:700}}>✓</span>}
            </div>

            <div style={{flex:1,minWidth:0}}>
              {/* Area + priority line */}
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
                <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:ac,letterSpacing:2}}>
                  {AREA_ICON[task.area]} {task.area.toUpperCase()}
                </span>
                <span style={{color:'var(--rim2)'}}>·</span>
                <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:pc,letterSpacing:2}}>
                  {PRIO_LABEL[task.priority]}
                </span>
                {task.recurring && <span style={{fontFamily:'var(--font-mono)',fontSize:8,color:'var(--muted)',letterSpacing:1}}>↺ {task.recurring.toUpperCase()}</span>}
                {dueInfo && <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:dueInfo.color,letterSpacing:1,marginLeft:'auto'}}>{dueInfo.label}</span>}
              </div>

              {/* Title */}
              <div style={{
                fontFamily:'var(--font-ui)',fontWeight:500,fontSize:14,
                color:task.done?'var(--muted)':'var(--text)',
                lineHeight:1.4,
                textDecoration:task.done?'line-through':'none',
              }}>{task.title}</div>

              {/* Note preview */}
              {task.note && !expanded && (
                <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--subtle)',marginTop:6,lineHeight:1.5,
                  padding:'6px 8px',background:'var(--elevated)',borderRadius:6,borderLeft:`2px solid var(--info)`,
                }}>
                  {task.note.length>72?task.note.slice(0,72)+'…':task.note}
                </div>
              )}
            </div>

            {/* Expand arrow */}
            <div style={{color:'var(--muted)',fontSize:10,marginTop:4,flexShrink:0,transition:'transform .2s',transform:expanded?'rotate(180deg)':'none'}}>▾</div>
          </div>

          {/* Expanded panel */}
          {expanded && (
            <div className="fade-in" style={{borderTop:'1px solid var(--rim)',padding:'12px 14px 14px'}}>
              {/* Note editor */}
              {!noteMode ? (
                <div style={{marginBottom:12}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                    <span style={{fontFamily:'var(--font-mono)',fontSize:8,color:'var(--info)',letterSpacing:3}}>◈ NOTES</span>
                    <button onClick={e=>{e.stopPropagation();setNoteMode(true)}}
                      style={{fontFamily:'var(--font-mono)',fontSize:8,color:'var(--subtle)',letterSpacing:2,padding:'2px 6px',border:'1px solid var(--rim)',borderRadius:4}}>
                      EDIT
                    </button>
                  </div>
                  {task.note
                    ? <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--mid)',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{task.note}</div>
                    : <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--muted)',fontStyle:'italic'}}>No notes. Tap edit to add context.</div>
                  }
                </div>
              ) : (
                <div onClick={e=>e.stopPropagation()} style={{marginBottom:12}}>
                  <textarea autoFocus value={noteVal} onChange={e=>setNoteVal(e.target.value)} rows={3}
                    placeholder="Add context, links, thoughts…"
                    style={{width:'100%',background:'var(--elevated)',border:'1px solid var(--rim2)',borderRadius:8,padding:'10px',color:'var(--text)',fontSize:12,lineHeight:1.6,outline:'none',marginBottom:8}}/>
                  <div style={{display:'flex',gap:6}}>
                    <button onClick={()=>{onUpdateNote(noteVal);setNoteMode(false)}}
                      style={{flex:1,padding:'8px',background:'var(--info)',border:'none',borderRadius:6,color:'#fff',fontFamily:'var(--font-mono)',fontSize:9,letterSpacing:2}}>SAVE</button>
                    <button onClick={()=>{setNoteVal(task.note||'');setNoteMode(false)}}
                      style={{padding:'8px 12px',background:'transparent',border:'1px solid var(--rim)',borderRadius:6,color:'var(--subtle)',fontSize:12}}>✕</button>
                  </div>
                </div>
              )}

              {/* Reminder + notification row */}
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {!hasNotify ? (
                  <>
                    {[[30*60000,'30 MIN'],[60*60000,'1 HR'],[3*60*60000,'3 HR']].map(([ms,l])=>(
                      <button key={l} onClick={e=>{e.stopPropagation();onSetNotify(Date.now()+ms)}}
                        style={{padding:'6px 10px',background:'var(--elevated)',border:'1px solid var(--rim2)',borderRadius:6,color:'var(--mid)',fontFamily:'var(--font-mono)',fontSize:9,letterSpacing:1}}>
                        ⏰ +{l}
                      </button>
                    ))}
                    <button onClick={e=>{e.stopPropagation();onOpenDateModal()}}
                      style={{padding:'6px 10px',background:'var(--elevated)',border:'1px solid var(--rim2)',borderRadius:6,color:'var(--mid)',fontFamily:'var(--font-mono)',fontSize:9,letterSpacing:1}}>
                      ⏰ CUSTOM
                    </button>
                  </>
                ) : (
                  <button onClick={e=>{e.stopPropagation();onClearNotify()}}
                    style={{padding:'6px 12px',background:'var(--elevated)',border:'1px solid var(--signal)40',borderRadius:6,color:'var(--signal)',fontFamily:'var(--font-mono)',fontSize:9,letterSpacing:1}}>
                    ⏰ {new Date(task.notifyAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} · CLEAR ✕
                  </button>
                )}
                <button onClick={e=>{e.stopPropagation();onDelete()}}
                  style={{marginLeft:'auto',padding:'6px 10px',background:'transparent',border:'1px solid var(--critical)30',borderRadius:6,color:'var(--critical)',fontFamily:'var(--font-mono)',fontSize:9,letterSpacing:1}}>
                  DELETE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
