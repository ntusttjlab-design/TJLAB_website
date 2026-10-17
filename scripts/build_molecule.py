"""驗證並封裝 PubChem 固定分子構形。"""
import json
from collections import Counter
from pathlib import Path
root = Path(__file__).resolve().parent.parent
record = json.loads((root / 'assets/data/n-phenylphthalimide.pubchem.json').read_text())['PC_Compounds'][0]
assert record['id']['id']['cid'] == 68215
elements = record['atoms']['element']
assert Counter(elements) == {6: 14, 1: 9, 7: 1, 8: 2}
coords = record['coords'][0]['conformers'][0]
symbols = {6: 'C', 1: 'H', 7: 'N', 8: 'O'}
atoms = [[symbols[n], *[coords[axis][i] for axis in 'xyz']] for i, n in enumerate(elements)]
bonds = list(zip(record['bonds']['aid1'], record['bonds']['aid2'], record['bonds']['order']))
valence = Counter()
for a, b, order in bonds:
    valence[a] += order
    valence[b] += order
    length = sum((coords[axis][a-1] - coords[axis][b-1]) ** 2 for axis in 'xyz') ** .5
    assert .9 < length < 1.65, (a, b, length)
for i, number in enumerate(elements, 1):
    assert valence[i] == {6: 4, 1: 1, 7: 3, 8: 2}[number], (i, valence[i])
edges = {frozenset((a, b)): order for a, b, order in bonds}
for ring in ([4, 5, 10, 14, 13, 9], [8, 11, 15, 17, 16, 12]):
    assert sorted(edges[frozenset((a, b))] for a, b in zip(ring, ring[1:] + ring[:1])) == [1, 1, 1, 2, 2, 2]
data = {'name': 'N-Phenylphthalimide', 'cid': 68215, 'formula': 'C14H9NO2', 'atoms': atoms, 'bonds': [[a-1, b-1, n] for a, b, n in bonds]}
(root / 'assets/js/molecule-data.js').write_text('// PubChem CID 68215，固定構形與明確鍵級；由 build_molecule.py 產生。\nwindow.labMoleculeData = ' + json.dumps(data, separators=(',', ':')) + ';\n', encoding='utf-8')
print('PASS：CID 68215；26原子、28鍵、C14H9NO2；價數、鍵長與兩個六員芳香環通過。')
