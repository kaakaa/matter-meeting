import {renderString} from "nunjucks";
import {makeBucket, upload} from '../../minio/MinioClient';

const sampleData = {
    "total_attendees": 5,
    "availabilities": [
        {
            "date": "2017/12/5",
            "schedules": [
                {"time": "08:00", "quality": 0},
                {"time": "08:30", "quality": 0},
                {"time": "09:00", "quality": 0},
                {"time": "09:30", "quality": 0}
            ]
        },
        {
            "date": "2017/12/6",
            "schedules": [
                {"time": "08:00", "quality": 0},
                {"time": "08:30", "quality": 0},
                {"time": "09:00", "quality": 0},
                {"time": "09:30", "quality": 0}
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

<svg width="850" height="150">
    {% for availability in data.availabilities -%}
    {% set dateIndex = loop.index0 %}
    <g>
        <text x=20 y={{ 20 + (15 * dateIndex) }} style="font-size:14px">{{ availability.date }}</text>
        {%- for schedule in availability.schedules -%}
        <rect x={{ 100 + (15 * loop.index0) }} y={{ 7 + (15 * dateIndex) }} width="15" height="15" style="fill:rgba(0,128,0,{{ schedule.quality }});stroke-width:1;stroke:rgb(0,0,0)" />
        {%- endfor %}
    </g>
    {%- endfor %}
    {% for i in range(0, (24 * 2) + 1, 4) %}
    <text x={{ 85 + (15 * i) }} y=125 style="font-size:14px">{{ i / 2 }}:00</text>
    {% endfor %}
</svg>`;

export function renderGrassSVG(data) {
    return new Promise(function(resolve, reject) {
        let svg = renderString(grassTemplate, {data: data});
        resolve(svg);
    });
};

export async function writeGrassSVG(id, data) {
    const fs = require("pn/fs");
    const svg2png = require("svg2png");

    return new Promise((
        renderGrassSVG(data))
            .then(svg2png)
            .then(buffer => upload("test", id, buffer, "image/png"))
            .catch(e => console.error(e))
        );
}
