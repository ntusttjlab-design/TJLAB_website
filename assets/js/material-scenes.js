'use strict';
// 三種結構獨立建模；玻璃只展示局部配位網絡，不冒充模擬軌跡。
function createLabMaterials() {
    const sphere = new THREE.SphereGeometry(1, 14, 10);
    const cylinder = new THREE.CylinderGeometry(.055, .055, 1, 8);
    const materials = {
        Si: new THREE.MeshStandardMaterial({color:0xc7b8df, roughness:.3}),
        O: new THREE.MeshStandardMaterial({color:0xed785d, roughness:.38}),
        C: new THREE.MeshStandardMaterial({color:0x99adb9, roughness:.3, metalness:.25}),
        bond: new THREE.MeshStandardMaterial({color:0x72838f, roughness:.45})
    };
    function mesh(atoms, bonds) {
        const group = new THREE.Group();
        atoms.forEach(([type,x,y,z]) => {
            const atom = new THREE.Mesh(sphere, materials[type]);
            atom.position.set(x,y,z);atom.scale.setScalar(type==='Si'?.28:.19);group.add(atom);
        });
        bonds.forEach(([a,b]) => {
            const start = new THREE.Vector3(...atoms[a].slice(1));
            const end = new THREE.Vector3(...atoms[b].slice(1));
            const delta = end.clone().sub(start);
            const bond = new THREE.Mesh(cylinder, materials.bond);
            bond.position.copy(start).add(end).multiplyScalar(.5);
            bond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.clone().normalize());
            bond.scale.y=delta.length();group.add(bond);
        });
        return group;
    }
    const atoms=[['Si',0,0,0]], bonds=[];
    const tetra=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(v=>new THREE.Vector3(...v).normalize());
    const ends=[];
    tetra.forEach(v=>{const p=v.clone().multiplyScalar(1.62);atoms.push(['O',...p.toArray()]);bonds.push([0,atoms.length-1]);ends.push({oxygen:atoms.length-1,parent:0});});
    // 固定角度與確定性的轉向，保持 Si–O 距離與四面體配位。
    for(let n=0;n<ends.length&&atoms.filter(a=>a[0]==='Si').length<17;n++) {
        const {oxygen,parent}=ends[n];
        const o=new THREE.Vector3(...atoms[oxygen].slice(1));
        const back=new THREE.Vector3(...atoms[parent].slice(1)).sub(o).normalize();
        const axis=new THREE.Vector3(.31,.73,.61).cross(back).normalize();
        const out=back.clone().applyAxisAngle(axis,144*Math.PI/180);
        const si=o.clone().addScaledVector(out,1.62);
        const q=new THREE.Quaternion().setFromUnitVectors(tetra[0],out.clone().negate());
        const turn=new THREE.Quaternion().setFromAxisAngle(out,n*1.73);
        const newO=tetra.slice(1).map(v=>v.clone().applyQuaternion(q).applyQuaternion(turn).multiplyScalar(1.62).add(si));
        if([si,...newO].some(p=>atoms.some((a,i)=>i!==oxygen&&p.distanceTo(new THREE.Vector3(...a.slice(1)))<1.15)))continue;
        const index=atoms.length;atoms.push(['Si',...si.toArray()]);bonds.push([index,oxygen]);
        newO.forEach(p=>{atoms.push(['O',...p.toArray()]);bonds.push([index,atoms.length-1]);ends.push({oxygen:atoms.length-1,parent:index});});
    }
    const glass=mesh(atoms,bonds);
    const carbon=[],carbonBonds=[];
    const d=1.42;
    // 六角晶格的雙原子基底與 AB 堆疊；層間不畫共價鍵。
    for(let layer=0;layer<3;layer++)for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++) {
        const x=Math.sqrt(3)*d*(i+j/2),y=1.5*d*j;
        for(const offset of [0,d])if(Math.hypot(x,y+offset)<7.6)carbon.push(['C',x,y+offset+(layer%2)*d,(layer-1)*3.35]);
    }
    for(let a=0;a<carbon.length;a++)for(let b=a+1;b<carbon.length;b++) {
        if(carbon[a][3]!==carbon[b][3])continue;
        if(Math.abs(Math.hypot(carbon[a][1]-carbon[b][1],carbon[a][2]-carbon[b][2])-d)<.01)carbonBonds.push([a,b]);
    }
    const graphite=mesh(carbon,carbonBonds);
    graphite.rotation.x=-.65;
    const molecule=createLabMolecule();
    const groups=[molecule,glass,graphite];
    groups.forEach(group=>{
        const box=new THREE.Box3().setFromObject(group),center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());
        group.children.forEach(child=>child.position.sub(center));
        group.scale.setScalar(18/Math.max(size.x,size.y,size.z));
    });
    return groups;
}
