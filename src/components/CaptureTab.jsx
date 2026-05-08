import React, { useState } from 'react'
import { askClaude } from '../api/claude'
import { AREA_COLOR, AREA_ICON, PRIO_COLOR } from '../constants'

const SYS=`Extract actionable tasks from a brain dump. Return ONLY valid JSON.
{"tasks":[{"title":"verb-first concise action","area":"Work|Property|Family|Home|Health|Finance|Other","priority":"high|medium|low","note":"any key context in 1 sentence or empty string"}]}
Max 6 tasks. Title must start with a verb. Infer area and priority from urgency and context.`

export function CaptureTab({ onImport }) {
  const [text,setText]=useState('')
  const [result,setResult]=useState(null)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState(null)

  async function extract(){
    if(!text.trim()||loading)return
    setLoading(true);setResult(null);setError(null)
    try{
      const raw=await askClaude(SYS,text.trim())
      const p=JSON.parse(raw.replace(/```json|```/g,'').trim())
      setResult(p.tasks||[])
    }catch{setError('Parse failed. Try rephrasing.')}
    setLoading(false)
  }

  function handleImport(){
    onImport(result)
    setResult(null)
    setText('')
  }

  return(
    <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>

      {/* Fixed header */}
      <div style={{padding:'14px 16px 12px',background:'var(--deep)',borderBottom:'1px solid var(--rim)',flexShrink:0}}>
        <div style={{fontFamily:'var(--font-mono)',fontSize:8,color:'var(--signal)',letterSpacing:5,marginBottom:2}}>⬡ INTAKE</div>
        <div style={{fontFamily:'var(--font-display)',fontSize:26,letterSpacing:3,color:'var(--bright)'}}>BRAIN DUMP</div>
        <div style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--subtle)',marginTop:2,letterSpacing:1}}>AI extracts structured tasks from raw thought</div>
      </div>

      {/* Scrollable content */}
      <div style={{flex:1,overflowY:'auto',padding:'14px'}}>
        <textarea value={text} onChange={e=>setText(e.target.value)}
          placeholder={"Write anything. Messy is fine.\n\nExamples:\n— R&D lead wants TinyTag shipped but BLE not tested yet\n— Need to call Nexa Solar about the 8KW quote\n— Book Dharamshala before prices go up, June 4-7\n— Don't forget daughter's school project Friday"}
          style={{
            width:'100%',minHeight:150,background:'var(--surface)',
            border:'1px solid var(--rim2)',borderRadius:16,
            padding:'16px',color:'var(--text)',fontSize:14,lineHeight:1.8,
            fontWeight:300,outline:'none',fontFamily:'var(--font-ui)',
          }}/>

        <button onClick={extract} disabled={loading||!text.trim()} style={{
          marginTop:10,width:'100%',padding:'15px',
          background:loading?'var(--surface)':text.trim()?'var(--signal)':'var(--surface)',
          border:`1px solid ${loading?'var(--rim)':text.trim()?'var(--signal)':'var(--rim2)'}`,
          borderRadius:14,
          color:loading?'var(--muted)':text.trim()?'var(--deep)':'var(--muted)',
          fontFamily:'var(--font-display)',fontSize:18,letterSpacing:4,
          transition:'all .2s',
        }}>
          {loading?<span className="pulsing">PROCESSING…</span>:'EXTRACT OPS'}
        </button>

        {error&&<div style={{marginTop:10,padding:'10px 14px',background:'#1a0808',border:'1px solid var(--critical)30',borderRadius:10,fontFamily:'var(--font-mono)',fontSize:11,color:'var(--critical)'}}>{error}</div>}

        {result&&result.length===0&&!error&&(
          <div style={{textAlign:'center',padding:'30px',fontFamily:'var(--font-mono)',fontSize:10,color:'var(--muted)',letterSpacing:3}}>NOTHING EXTRACTED · TRY MORE DETAIL</div>
        )}

        {result&&result.length>0&&(
          <>
            <div style={{padding:'16px 0 8px',display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontFamily:'var(--font-mono)',fontSize:8,letterSpacing:4,color:'var(--muted)'}}>EXTRACTED</span>
              <div style={{height:1,flex:1,background:'linear-gradient(90deg,var(--signal)40,transparent)'}}/>
              <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--signal)',background:'var(--signal)15',border:'1px solid var(--signal)30',borderRadius:3,padding:'1px 8px'}}>{result.length}</span>
            </div>
            {result.map((t,i)=>(
              <div key={i} className="fade-up" style={{animationDelay:`${i*.06}s`,marginBottom:8,
                padding:'14px',background:'var(--surface)',
                border:`1px solid ${AREA_COLOR[t.area]||'var(--rim)'}30`,
                borderLeft:`2px solid ${AREA_COLOR[t.area]||'var(--dim)'}`,
                borderRadius:12,
              }}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:AREA_COLOR[t.area]||'var(--dim)',letterSpacing:2}}>
                    {AREA_ICON[t.area]} {(t.area||'Other').toUpperCase()}
                  </span>
                  <span style={{color:'var(--rim2)'}}>·</span>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:PRIO_COLOR[t.priority]||'var(--dim)',letterSpacing:2}}>
                    {(t.priority||'medium').toUpperCase()}
                  </span>
                </div>
                <div style={{fontFamily:'var(--font-ui)',fontWeight:500,fontSize:14,color:'var(--text)',lineHeight:1.4,marginBottom:t.note?6:0}}>{t.title}</div>
                {t.note&&<div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--subtle)',lineHeight:1.5}}>{t.note}</div>}
              </div>
            ))}
            {/* Spacer so last card isn't hidden behind sticky footer */}
            <div style={{height:80}}/>
          </>
        )}
      </div>

      {/* Sticky footer — ADD TO OPS always visible when results exist */}
      {result&&result.length>0&&(
        <div style={{
          flexShrink:0,
          padding:'12px 14px',
          paddingBottom:'calc(12px + env(safe-area-inset-bottom,0px))',
          background:'linear-gradient(0deg,var(--deep) 80%,transparent)',
          borderTop:'1px solid var(--rim)',
        }}>
          <button onClick={handleImport} style={{
            width:'100%',padding:'16px',
            background:'var(--signal)',border:'none',
            borderRadius:14,color:'var(--deep)',
            fontFamily:'var(--font-display)',fontSize:18,letterSpacing:4,
            boxShadow:'0 0 24px var(--signal)40',
          }}>
            ADD TO OPS BOARD →
          </button>
        </div>
      )}
    </div>
  )
}
