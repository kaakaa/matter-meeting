const assert = require('chai').assert;

const grass = require('../../lib/helpers/grass');

describe('renderGrassSVG', () => {
    it('render sample SVG string', async () => {
        const actual = await grass.renderGrassSVG({
            availabilities: [
                {
                    date: "2018-01-01",
                    schedules: [
                        {quality: 1.0},
                        {quality: 0.5},
                        {quality: 0.1}
                    ]
                },
                {
                    date: "2018-01-02",
                    schedules: [
                        {quality: 1.0},
                        {quality: 0.5},
                        {quality: 0.1}
                    ]
                }
            ]
        });

        const expected = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="850" height="150" xmlns="http://www.w3.org/2000/svg" version="1.1">
    
    <g>
        <text x="20" y="20" style="font-size:14px">2018-01-01</text><rect x="100" y="7" width="15" height="15" style="fill:rgba(0,128,0,1);stroke-width:1;stroke:rgb(0,0,0)" /><rect x="115" y="7" width="15" height="15" style="fill:rgba(0,128,0,0.5);stroke-width:1;stroke:rgb(0,0,0)" /><rect x="130" y="7" width="15" height="15" style="fill:rgba(0,128,0,0.1);stroke-width:1;stroke:rgb(0,0,0)" />
    </g>
    <g>
        <text x="20" y="35" style="font-size:14px">2018-01-02</text><rect x="100" y="22" width="15" height="15" style="fill:rgba(0,128,0,1);stroke-width:1;stroke:rgb(0,0,0)" /><rect x="115" y="22" width="15" height="15" style="fill:rgba(0,128,0,0.5);stroke-width:1;stroke:rgb(0,0,0)" /><rect x="130" y="22" width="15" height="15" style="fill:rgba(0,128,0,0.1);stroke-width:1;stroke:rgb(0,0,0)" />
    </g>
    
    <text x="85" y="125" style="font-size:14px">0:00</text>
    
    <text x="145" y="125" style="font-size:14px">2:00</text>
    
    <text x="205" y="125" style="font-size:14px">4:00</text>
    
    <text x="265" y="125" style="font-size:14px">6:00</text>
    
    <text x="325" y="125" style="font-size:14px">8:00</text>
    
    <text x="385" y="125" style="font-size:14px">10:00</text>
    
    <text x="445" y="125" style="font-size:14px">12:00</text>
    
    <text x="505" y="125" style="font-size:14px">14:00</text>
    
    <text x="565" y="125" style="font-size:14px">16:00</text>
    
    <text x="625" y="125" style="font-size:14px">18:00</text>
    
    <text x="685" y="125" style="font-size:14px">20:00</text>
    
    <text x="745" y="125" style="font-size:14px">22:00</text>
    
    <text x="805" y="125" style="font-size:14px">24:00</text>
    
</svg>`;

        assert.equal(actual, expected);
    });
});