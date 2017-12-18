import {renderString} from "nunjucks";
import {upload} from '../../helpers/minio';

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

<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="850" height="150" xmlns="http://www.w3.org/2000/svg" version="1.1">
    {% for availability in data.availabilities -%}
    {% set dateIndex = loop.index0 %}
    <g>
        <text x="20" y="{{ 20 + (15 * dateIndex) }}" style="font-size:14px">{{ availability.date }}</text>
        {%- for schedule in availability.schedules -%}
        <rect x="{{ 100 + (15 * loop.index0) }}" y="{{ 7 + (15 * dateIndex) }}" width="15" height="15" style="fill:rgba(0,128,0,{{ schedule.quality }});stroke-width:1;stroke:rgb(0,0,0)" />
        {%- endfor %}
    </g>
    {%- endfor %}
    {% for i in range(0, (24 * 2) + 1, 4) %}
    <text x="{{ 85 + (15 * i) }}" y="125" style="font-size:14px">{{ i / 2 }}:00</text>
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

    return renderGrassSVG(data)
	    .then((d) => Buffer.from(d, 'utf-8'))
            .then(buffer => upload("test", id, buffer, "image/png"))
            .catch(e => console.error(e));
}
