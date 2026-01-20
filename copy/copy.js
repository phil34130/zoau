const zoau = require('../lib/zoau');

const ID = process.env.USER;
const DS1 = `${ID}.ZOAU1A`;
const DS2 = `${ID}.ZOAU1B`;
const DSP = `${ID}.ZOAU1?`;

function errfunc(err) {
  throw err;
}

async function test() {
    let res, exp;

    console.log('Test: delete work datasets');
    await zoau.datasets.delete(DSP, {'options' : '-f'});
    let details = { 'record_length' : 400 };
    console.log('Test: create');
    await zoau.datasets.create(DS1, 'SEQ' , details).then(console.log);

    console.log('Test: create');
    await zoau.datasets.create(DS2, 'SEQ' , details).then(console.log);

    console.log('Test: copy a USS source file');
    res = await zoau.datasets.copy('/etc/profile', DS1);
    if (res['rc'] !== 0 || res['stderr'].length !== 0) {
      errfunc(`copy failed: ${res['stderr']}`);
    }

    console.log('Test: write another line');
    let line = 'This is the first line.';
    await zoau.datasets.write(DS1, line);

    // TODO(gabylb): this is to test passing options, as well -B is currently required (by 'cp') to preserve the white space in the target dataset:
    console.log('Test: copy a dataset as binary');
    await zoau.datasets.copy(DS1, DS2, {'options' : '-B'});

    console.log('Test: read to verify');
    res = await zoau.datasets.read(DS2, {'tail' : 1});
    exp = line.padEnd(80, ' ');
    if (res !== exp) {
      errfunc(`unexpected line in ${DS2}: found:\n|${res}|\nexpected:\n|${exp}|`);
    }

    console.log('All tests passed.');
  }

test();
