import React, { useState } from 'react'

const PROMPTS = [
  'What is the single most important thing I need to move today?',
  'What am I avoiding and why?',
  'What would make today a win?',
  'What drained me yesterday? What energized me?',
  'What decision am I postponing that I should just make?',
]

export function JournalTab({ entries, setEntries }) {
  const [mode, setMode]       = useState('list')   // 'list' | 'write' | 'view'
  const [draft, setDraft]     = useState('')
  const [draftTitle, setDraftTitle] = useState('')
  const [viewing, setViewing] = useState(null)
  const [prompt, setPrompt]   = useState(null)

  function newEntry() {
    const today = new Date().toLocaleDateString('en-GB',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})
    setDraftTitle(today)
    setDraft('')
    setPrompt(PROMPTS[Math.floor(Math.random()*PROMPTS.length)])
    setMode('write')
  }

  function saveEntry() {
    if (!draft.trim()) return
    const entry = {
      id: Date.now(),
      title: draftTitle || new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}),
      body: draft.trim(),
      ts: Date.now(),
      wordCount: draft.trim().split(/\s+/).length,
    }
    setEntries(p=>[entry,...p])
    setMode('list')
    setDraft(''); setDraftTitle('')
  }

  function deleteEntry(id) { setEntries(p=>p.filter(e=>e.id!==id)) }

  // Write mode
  if (mode==='write') return (
    <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div style={{padding:'14px 16px 10px',borderBottom:'1px solid var(--rim)',flexShrink:0}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <button onClick={()=>setMode('list')} style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--subtle)',letterSpacing:2,padding:'4px 8px',border:'1px solid var(--rim)',borderRadius:6}}>← BACK</button>
          <button onClick={saveEntry} disabled={!draft.trim()} style={{fontFamily:'var(--font-display)',fontSize:14,letterSpacing:3,color:draft.trim()?'var(--signal)':'var(--muted)',padding:'4px 12px',border:`1px solid ${draft.trim()?'var(--signal)30':'var(--rim)'}`,borderRadius:6}}>SAVE ENTRY</button>
        </div>
        <input value={draftTitle} onChange={e=>setDraftTitle(e.target.value)}
          style={{width:'100%',background:'transparent',border:'none',color:'var(--text)',fontFamily:'var(--font-display)',fontSize:22,letterSpacing:2,outline:'none'}}/>
        <div style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--muted)',marginTop:4,letterSpacing:2}}>
          {draft.trim().split(/\s+/).filter(Boolean).length} WORDS · {new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
        </div>
      </div>

      {prompt&&(
        <div style={{padding:'10px 16px',background:'var(--elevated)',borderBottom:'1px solid var(--rim)',flexShrink:0}}>
          <div style={{fontFamily:'var(--font-mono)',fontSize:8,color:'var(--signal)',letterSpacing:3,marginBottom:4}}>◎ PROMPT</div>
          <div style={{fontFamily:'var(--font-ui)',fontSize:12,color:'var(--dim)',lineHeight:1.5,fontStyle:'italic'}}>"{prompt}"</div>
          <button onClick={()=>setPrompt(PROMPTS[Math.floor(Math.random()*PROMPTS.length)])}
            style={{fontFamily:'var(--font-mono)',fontSize:8,color:'var(--subtle)',letterSpacing:2,marginTop:6}}>↺ NEW PROMPT</button>
        </div>
      )}

      <textarea value={draft} onChange={e=>setDraft(e.target.value)} autoFocus
        placeholder="Write freely. No formatting needed. Just think."
        style={{
          flex:1,padding:'16px',background:'transparent',border:'none',
          color:'var(--text)',fontSize:15,lineHeight:1.9,outline:'none',
          fontFamily:'var(--font-ui)',fontWeight:300,
          paddingBottom:'calc(var(--nav-h) + 20px)',
        }}/>
    </div>
  )

  // View mode
  if (mode==='view'&&viewing) return (
    <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div style={{padding:'14px 16px',borderBottom:'1px solid var(--rim)',flexShrink:0,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <button onClick={()=>{setMode('list');setViewing(null)}} style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--subtle)',letterSpacing:2,padding:'4px 8px',border:'1px solid var(--rim)',borderRadius:6}}>← BACK</button>
        <button onClick={()=>{deleteEntry(viewing.id);setMode('list');setViewing(null)}}
          style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--critical)',letterSpacing:2,padding:'4px 8px',border:'1px solid var(--critical)30',borderRadius:6}}>DELETE</button>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'16px',paddingBottom:'calc(var(--nav-h)+20px)'}}>
        <div style={{fontFamily:'var(--font-display)',fontSize:20,letterSpacing:2,color:'var(--bright)',marginBottom:4}}>{viewing.title}</div>
        <div style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--muted)',letterSpacing:2,marginBottom:20}}>{viewing.wordCount} WORDS · {new Date(viewing.ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
        <div style={{fontFamily:'var(--font-ui)',fontSize:15,color:'var(--text)',lineHeight:1.9,fontWeight:300,whiteSpace:'pre-wrap'}}>{viewing.body}</div>
      </div>
    </div>
  )

  // List mode
  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div style={{padding:'14px 16px 10px',flexShrink:0}}>
        <div style={{fontFamily:'var(--font-mono)',fontSize:8,color:'var(--signal)',letterSpacing:5,marginBottom:4}}>◈ FIELD LOG</div>
        <div style={{fontFamily:'var(--font-display)',fontSize:26,letterSpacing:3,color:'var(--bright)'}}>JOURNAL</div>
      </div>

      {/* New entry */}
      <div style={{padding:'0 14px 10px',flexShrink:0}}>
        <button onClick={newEntry} style={{
          width:'100%',padding:'16px',background:'var(--surface)',
          border:'1px solid var(--signal)30',borderRadius:14,
          display:'flex',alignItems:'center',gap:12,
          transition:'all .2s',
        }}>
          <div style={{width:36,height:36,borderRadius:8,background:'var(--signal)15',border:'1px solid var(--signal)30',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <span style={{fontFamily:'var(--font-display)',fontSize:20,color:'var(--signal)'}}>+</span>
          </div>
          <div style={{textAlign:'left'}}>
            <div style={{fontFamily:'var(--font-display)',fontSize:16,letterSpacing:3,color:'var(--signal)'}}>NEW ENTRY</div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--subtle)',marginTop:2,letterSpacing:1}}>
              {new Date().toLocaleDateString('en-GB',{weekday:'long',day:'2-digit',month:'short'})}
            </div>
          </div>
        </button>
      </div>

      {/* Entries list */}
      <div style={{flex:1,overflowY:'auto',padding:'0 14px',paddingBottom:'calc(var(--nav-h)+16px)'}}>
        {entries.length===0?(
          <div style={{textAlign:'center',padding:'60px 20px'}}>
            <div style={{fontFamily:'var(--font-display)',fontSize:36,letterSpacing:6,color:'var(--rim)',marginBottom:8}}>EMPTY</div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--muted)',letterSpacing:3}}>NO ENTRIES YET</div>
          </div>
        ):entries.map((e,i)=>(
          <div key={e.id} className="fade-up" style={{animationDelay:`${i*.04}s`,marginBottom:8}}
            onClick={()=>{setViewing(e);setMode('view')}}>
            <div style={{
              padding:'14px',background:'var(--surface)',
              border:'1px solid var(--rim)',borderRadius:12,
              display:'flex',gap:12,alignItems:'flex-start',
              cursor:'pointer',transition:'border-color .2s',
            }}>
              <div style={{
                width:36,height:36,borderRadius:8,background:'var(--elevated)',
                display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
                flexShrink:0,border:'1px solid var(--rim2)',
              }}>
                <div style={{fontFamily:'var(--font-display)',fontSize:16,color:'var(--text)',lineHeight:1}}>{new Date(e.ts).getDate()}</div>
                <div style={{fontFamily:'var(--font-mono)',fontSize:7,color:'var(--muted)',letterSpacing:1}}>{new Date(e.ts).toLocaleDateString('en-GB',{month:'short'}).toUpperCase()}</div>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:'var(--font-ui)',fontWeight:600,fontSize:13,color:'var(--text)',marginBottom:4,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{e.title}</div>
                <div style={{fontFamily:'var(--font-ui)',fontSize:11,color:'var(--dim)',lineHeight:1.5,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
                  {e.body}
                </div>
              </div>
              <div style={{fontFamily:'var(--font-mono)',fontSize:8,color:'var(--muted)',flexShrink:0,marginTop:2,letterSpacing:1}}>
                {e.wordCount}w
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
