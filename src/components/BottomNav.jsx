import React from 'react'
import { NAV_TABS } from '../constants'

export function BottomNav({ tab, setTab }) {
  return (
    <div style={{
      position:'fixed',bottom:0,left:0,right:0,zIndex:200,
      background:'rgba(5,5,8,0.95)',
      backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',
      borderTop:'1px solid var(--rim)',
      paddingBottom:'env(safe-area-inset-bottom,0px)',
      display:'flex',
    }}>
      {NAV_TABS.map(({id,sym,label})=>{
        const active = tab===id
        return (
          <button key={id} className="nav-btn" onClick={()=>setTab(id)} style={{
            flex:1, padding:'12px 4px 10px',
            display:'flex',flexDirection:'column',alignItems:'center',gap:3,
            color:active?'var(--signal)':'var(--muted)',
            position:'relative',overflow:'hidden',
            borderTop:active?'1px solid var(--signal)':'1px solid transparent',
            marginTop:-1,
            transition:'color .2s',
          }}>
            {active && <div style={{
              position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',
              width:40,height:1,
              background:'linear-gradient(90deg,transparent,var(--signal),transparent)',
              boxShadow:'0 0 12px var(--signal)',
            }}/>}
            <span style={{
              fontFamily:'var(--font-display)',fontSize:18,lineHeight:1,letterSpacing:1,
              transform:active?'scale(1.1)':'scale(1)',
              transition:'transform .2s',
              filter:active?`drop-shadow(0 0 4px var(--signal))`:'none',
            }}>{sym}</span>
            <span style={{fontFamily:'var(--font-mono)',fontSize:8,letterSpacing:3}}>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
