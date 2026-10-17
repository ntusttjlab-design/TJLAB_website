'use strict';
// 依 IUPAC 原子序排列；遊戲只使用元素身分改變外觀，不改變物理規則。
window.labElements = [
['H','Hydrogen','氫'],['He','Helium','氦'],['Li','Lithium','鋰'],['Be','Beryllium','鈹'],['B','Boron','硼'],['C','Carbon','碳'],['N','Nitrogen','氮'],['O','Oxygen','氧'],['F','Fluorine','氟'],['Ne','Neon','氖'],
['Na','Sodium','鈉'],['Mg','Magnesium','鎂'],['Al','Aluminium','鋁'],['Si','Silicon','矽'],['P','Phosphorus','磷'],['S','Sulfur','硫'],['Cl','Chlorine','氯'],['Ar','Argon','氬'],['K','Potassium','鉀'],['Ca','Calcium','鈣'],
['Sc','Scandium','鈧'],['Ti','Titanium','鈦'],['V','Vanadium','釩'],['Cr','Chromium','鉻'],['Mn','Manganese','錳'],['Fe','Iron','鐵'],['Co','Cobalt','鈷'],['Ni','Nickel','鎳'],['Cu','Copper','銅'],['Zn','Zinc','鋅'],
['Ga','Gallium','鎵'],['Ge','Germanium','鍺'],['As','Arsenic','砷'],['Se','Selenium','硒'],['Br','Bromine','溴'],['Kr','Krypton','氪'],['Rb','Rubidium','銣'],['Sr','Strontium','鍶'],['Y','Yttrium','釔'],['Zr','Zirconium','鋯'],
['Nb','Niobium','鈮'],['Mo','Molybdenum','鉬'],['Tc','Technetium','鎝'],['Ru','Ruthenium','釕'],['Rh','Rhodium','銠'],['Pd','Palladium','鈀'],['Ag','Silver','銀'],['Cd','Cadmium','鎘'],['In','Indium','銦'],['Sn','Tin','錫'],
['Sb','Antimony','銻'],['Te','Tellurium','碲'],['I','Iodine','碘'],['Xe','Xenon','氙'],['Cs','Caesium','銫'],['Ba','Barium','鋇'],['La','Lanthanum','鑭'],['Ce','Cerium','鈰'],['Pr','Praseodymium','鐠'],['Nd','Neodymium','釹'],
['Pm','Promethium','鉕'],['Sm','Samarium','釤'],['Eu','Europium','銪'],['Gd','Gadolinium','釓'],['Tb','Terbium','鋱'],['Dy','Dysprosium','鏑'],['Ho','Holmium','鈥'],['Er','Erbium','鉺'],['Tm','Thulium','銩'],['Yb','Ytterbium','鐿'],
['Lu','Lutetium','鎦'],['Hf','Hafnium','鉿'],['Ta','Tantalum','鉭'],['W','Tungsten','鎢'],['Re','Rhenium','錸'],['Os','Osmium','鋨'],['Ir','Iridium','銥'],['Pt','Platinum','鉑'],['Au','Gold','金'],['Hg','Mercury','汞'],
['Tl','Thallium','鉈'],['Pb','Lead','鉛'],['Bi','Bismuth','鉍'],['Po','Polonium','釙'],['At','Astatine','砈'],['Rn','Radon','氡'],['Fr','Francium','鍅'],['Ra','Radium','鐳'],['Ac','Actinium','錒'],['Th','Thorium','釷'],
['Pa','Protactinium','鏷'],['U','Uranium','鈾'],['Np','Neptunium','錼'],['Pu','Plutonium','鈽'],['Am','Americium','鋂'],['Cm','Curium','鋦'],['Bk','Berkelium','鉳'],['Cf','Californium','鉲'],['Es','Einsteinium','鑀'],['Fm','Fermium','鐨'],
['Md','Mendelevium','鍆'],['No','Nobelium','鍩'],['Lr','Lawrencium','鐒'],['Rf','Rutherfordium','鑪'],['Db','Dubnium','𨧀'],['Sg','Seaborgium','𨭎'],['Bh','Bohrium','𨨏'],['Hs','Hassium','𨭆'],['Mt','Meitnerium','䥑'],['Ds','Darmstadtium','鐽'],
['Rg','Roentgenium','錀'],['Cn','Copernicium','鎶'],['Nh','Nihonium','鉨'],['Fl','Flerovium','鈇'],['Mc','Moscovium','鏌'],['Lv','Livermorium','鉝'],['Ts','Tennessine','鿬'],['Og','Oganesson','鿫']
];
