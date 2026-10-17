'use strict';
// 共用固定構形與明確鍵級，不根據距離猜測鍵結。
function createLabMolecule() {
    const data=window.labMoleculeData,group=new THREE.Group();
    const colors={C:0x3b4753,H:0xe6e9ed,N:0x3271ce,O:0xdf4545};
    const sphere=new THREE.SphereGeometry(1,20,16),cylinder=new THREE.CylinderGeometry(.065,.065,1,10);
    const materials=Object.fromEntries(Object.entries(colors).map(([key,color])=>[key,new THREE.MeshStandardMaterial({color,roughness:.35,metalness:.08})]));
    const bondMaterial=new THREE.MeshStandardMaterial({color:0x879990,roughness:.5});
    const points=data.atoms.map(([,x,y,z])=>new THREE.Vector3(x,y,z));
    const center=new THREE.Box3().setFromPoints(points).getCenter(new THREE.Vector3());
    points.forEach(point=>point.sub(center).multiplyScalar(1.65));
    data.atoms.forEach(([type],index)=>{const atom=new THREE.Mesh(sphere,materials[type]);atom.position.copy(points[index]);atom.scale.setScalar(type==='H'?.22:.36);group.add(atom);});
    const up=new THREE.Vector3(0,1,0);
    data.bonds.forEach(([a,b,order])=>{
        const delta=new THREE.Vector3().subVectors(points[b],points[a]);
        const offset=new THREE.Vector3(-delta.y,delta.x,0).normalize().multiplyScalar(.11);
        for(let n=0;n<order;n++){const bond=new THREE.Mesh(cylinder,bondMaterial);bond.position.copy(points[a]).add(points[b]).multiplyScalar(.5).addScaledVector(offset,order===1?0:n===0?-1:1);bond.quaternion.setFromUnitVectors(up,delta.clone().normalize());bond.scale.y=delta.length();group.add(bond);}
    });
    return group;
}
