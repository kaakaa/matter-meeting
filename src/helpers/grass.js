import {renderString} from 'nunjucks';
import {uploadObject} from './minio';

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

export function renderGrassSVG(d) {
    return new Promise((resolve) => {
        const data = {data: d};
        const svg = renderString(grassTemplate, data);
        resolve(svg);
    });
}

export function writeGrassSVG(bucket, data) {
    return renderGrassSVG(data)
        .then((d) => Buffer.from(d, 'utf-8'))
        .then((buffer) => uploadObject(bucket, data.id, buffer, 'image/png'))
        .catch((e) => console.error(e)); // eslint-disable-line no-console
}
