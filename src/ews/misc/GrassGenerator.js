// TODO: Generator of grass-graph from schedule availability
import {renderString} from "nunjucks";

const sampleData = {
    "total_attendees": 5,
    "availabilities": [
        {
            "date": "2017/12/5",
            "attendees": [
                {"time": "08:00", "attendee": ["test@example.com"]},
                {"time": "08:30", "attendee": ["test@example.com"]},
                {"time": "09:00", "attendee": ["test@example.com"]},
                {"time": "09:30", "attendee": ["test@example.com"]}
            ]
        },
        {
            "date": "2017/12/6",
            "attendees": [
                {"time": "08:00", "attendee": []},
                {"time": "08:30", "attendee": ["test@example.com"]},
                {"time": "09:00", "attendee": ["test@example.com"]},
                {"time": "09:30", "attendee": ["test@example.com"]}
            ]
        }
    ]
};

const grassTemplate = `
{%- macro length(elements) -%}
{{ elements | length }}
{%- endmacro -%}

{%- macro opaque(elements, sum) -%}
{{ length(elements) / sum }}
{%- endmacro -%}

<svg width="500" height="110">
    {% for availability in data.availabilities -%}
    {% set dateIndex = loop.index0 %}
    <g>
        <text x=0 y={{ 20 + (15 * dateIndex) }} style="font-size:14px">{{ availability.date }}</text>
        {%- for attendee in availability.attendees -%}
        {% set op = opaque(attendee.attendee, data.total_attendees) %}
        <rect x={{ 100 + (15 * loop.index0) }} y={{ 7 + (15 * dateIndex) }} width="15" height="15" style="fill:rgba(0,255,0,{{ op }});stroke-width:1;stroke:rgb(0,0,0)" />
        {%- endfor %}
    </g>
    {%- endfor %}
</svg>`;

export function renderGrassSVG(data) {
    return new Promise(function(resolve, reject) {
        let svg = renderString(grassTemplate, {data: data});
        console.log(svg);
        resolve(svg);
    });
};

export function writeGrassSVG(data, client) {
    const fs = require("pn/fs");
    const svg2png = require("svg2png");

    Promise.resolve(renderGrassSVG(data))
        .then(svg2png)
        // .then(buffer => fs.writeFile("dest.png", buffer))
        .then(buffer => client.upload("hoge", buffer, "image/png"))
        .catch(e => console.error(e));
}

import {MinioClient} from '../../minio/MinioClient';
var client = new MinioClient()
writeGrassSVG(sampleData, client);