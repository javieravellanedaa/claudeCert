/* Capa de sincronización: Firebase si hay config, localStorage si no.
   API única para auth (verificación por email), grupos y progreso. */
window.Cloud = {
  enabled: false,
  init(){
    try{
      if(window.FIREBASE_CONFIG && window.firebase){
        firebase.initializeApp(window.FIREBASE_CONFIG);
        this.auth = firebase.auth();
        this.db = firebase.firestore();
        this.enabled = true;
      }
    }catch(e){console.warn('Cloud init failed, using local mode', e)}
  },

  /* ---- verificación por email ---- */
  async sendVerification(email){
    if(this.enabled){
      await this.auth.sendSignInLinkToEmail(email, {
        url: location.origin + location.pathname,
        handleCodeInApp: true
      });
      localStorage.setItem('cc_pending_email', email);
      return {mode:'email'};                      // el usuario recibe un LINK real
    }
    // modo local: código mostrado en pantalla (demo, sin backend de correo)
    const code = String(Math.floor(100000 + Math.random()*900000));
    sessionStorage.setItem('cc_local_code::'+email, code);
    return {mode:'local', code};
  },
  verifyLocalCode(email, code){
    return sessionStorage.getItem('cc_local_code::'+email) === String(code).trim();
  },
  async completeEmailLink(){                       // llamar al cargar la página
    if(!this.enabled) return null;
    if(this.auth.isSignInWithEmailLink(location.href)){
      let em = localStorage.getItem('cc_pending_email');
      if(!em) em = prompt('Confirmá tu email para completar la verificación:');
      await this.auth.signInWithEmailLink(em, location.href);
      localStorage.removeItem('cc_pending_email');
      history.replaceState({}, '', location.pathname + location.hash);
      return em.toLowerCase();
    }
    return null;
  },

  /* ---- progreso compartido ---- */
  async pushProgress(email, summary){
    if(!this.enabled) return;
    try{await this.db.collection('progress').doc(email).set(
      {...summary, updatedAt: Date.now()}, {merge:true});}catch(e){}
  },
  async getProgress(emails){
    const out={};
    if(this.enabled){
      await Promise.all(emails.map(async e=>{
        try{const d=await this.db.collection('progress').doc(e).get();
        if(d.exists) out[e]=d.data();}catch(err){}
      }));
    } else {
      emails.forEach(e=>{
        const raw=localStorage.getItem('claudecert_ccaf_v1::'+e);
        if(raw){const st=JSON.parse(raw);
          let known=0,seen=0,answered=0,correct=0;
          Object.values(st).forEach(v=>{if(v.status==='known')known++;if(v.status)seen++;
            if(v.a){answered+=v.a;correct+=v.c||0}});
          out[e]={known,seen,answered,correct};}
      });
    }
    return out;
  },

  /* ---- grupos de estudio ---- */
  _localGroups(){return JSON.parse(localStorage.getItem('cc_groups')||'{}')},
  _saveLocalGroups(g){localStorage.setItem('cc_groups',JSON.stringify(g))},
  genCode(){const c='ABCDEFGHJKMNPQRSTUVWXYZ23456789';let s='';
    for(let i=0;i<6;i++)s+=c[Math.floor(Math.random()*c.length)];return s},
  async createGroup(name, email){
    const code=this.genCode();
    const g={name, code, members:[email], createdBy:email, createdAt:Date.now()};
    if(this.enabled){await this.db.collection('groups').doc(code).set(g)}
    else{const all=this._localGroups();all[code]=g;this._saveLocalGroups(all)}
    return g;
  },
  async joinGroup(code, email){
    code=code.trim().toUpperCase();
    if(this.enabled){
      const ref=this.db.collection('groups').doc(code);
      const d=await ref.get();
      if(!d.exists) throw new Error('No existe un grupo con ese código.');
      await ref.update({members: firebase.firestore.FieldValue.arrayUnion(email)});
      return {...d.data(), members:[...new Set([...d.data().members, email])]};
    }
    const all=this._localGroups();
    if(!all[code]) throw new Error('No existe un grupo con ese código (en este navegador — el modo local no ve grupos de otros dispositivos).');
    if(!all[code].members.includes(email)) all[code].members.push(email);
    this._saveLocalGroups(all);
    return all[code];
  },
  async myGroups(email){
    if(this.enabled){
      const snap=await this.db.collection('groups')
        .where('members','array-contains',email).get();
      return snap.docs.map(d=>d.data());
    }
    return Object.values(this._localGroups()).filter(g=>g.members.includes(email));
  },
  async leaveGroup(code, email){
    if(this.enabled){
      await this.db.collection('groups').doc(code).update(
        {members: firebase.firestore.FieldValue.arrayRemove(email)});
    } else {
      const all=this._localGroups();
      if(all[code]){all[code].members=all[code].members.filter(m=>m!==email);
        if(!all[code].members.length)delete all[code];this._saveLocalGroups(all)}
    }
  },
};
