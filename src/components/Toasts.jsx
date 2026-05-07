import React from 'react'

export function Toasts({ toasts, remove }) {
  return (
    <div style={{
      position:'fixed',top:'calc(env(safe-area-inset-top,0px) + 10px)',right:12,
      zIndex:9999,display:'flex',flexDirection:'column',gap:8,
      maxWidth:300,width:'calc(100vw - 24px)',pointerEvents:'none',
    }}>
      {toasts.map(t=>(
        <div key={t.id} className={t.exiting?'toast-out':'toast-in'}
          style={{
            pointerEvents:'all',
            background:'var(--elevated)',
            border:`1px solid ${t.color}40`,
            borderLeft:`3px solid ${t.color}`,
            borderRadius:10,padding:'12px 14px',
            display:'flex',gap:10,alignItems:'flex-start',
            boxShadow:`0 16px 40px #00000080,0 0 0 1px ${t.color}10`,
          }}>
          <span style={{fontSize:16,flexShrink:0,lineHeight:1,marginTop:1}}>{t.icon}</span>
          <div style={{flex:1}}>
            <div style={{fontFamily:'var(--font-mono)',fontSize:9,fontWeight:500,color:t.color,letterSpacing:3,marginBottom:3}}>{t.title}</div>
            <div style={{fontFamily:'var(--font-ui)',fontSize:11,color:'var(--mid)',lineHeight:1.5}}>{t.body}</div>
          </div>
          <button onClick={()=>remove(t.id)} style={{color:'var(--muted)',fontSize:14,lineHeight:1,padding:2,flexShrink:0}}>✕</button>
        </div>
      ))}
    </div>
  )
}
