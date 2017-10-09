// Define color
var colors = {};
colors['K'] = '#A9E500';
colors['L'] = '#A9E500';
colors['M'] = '#A9E500';
colors['N'] = '#A9E500';
colors['O'] = '#A9E500';
colors['P'] = '#A9E500';
colors['Q'] = '#A9E500';
colors['R'] = '#A9E500';
colors['B'] = '#AFD706';
colors['A'] = '#B5CA0C';
colors['C'] = '#BBBD12';
colors['I'] = '#C2B018';
colors['J'] = '#C2B018';
colors['H'] = '#C8A31E';
colors['G'] = '#CE9625';
colors['F'] = '#DB7C31';
colors['D'] = '#E7623D';
colors['E'] = '#F4484A';

function visualize() {
    // Get AOI raw data
    var element_aoi = document.getElementById('aoi');
    var aoi_data = element_aoi.value;

    // Convert AOI raw data to js array
    var aoi_data_csv = CSVToArray(aoi_data, ' ');

    // Remove AOI name and alias
    for (var i = 0; i < aoi_data_csv.length; i++) {
        aoi_data_csv[i] = aoi_data_csv[i].slice(1, 6);
    }

    // load data from eye tracking data
    var average_durations = {};
    average_durations['A'] = 0 / 13;
    average_durations['B'] = 1 / 13;
    average_durations['C'] = 1 / 13;
    average_durations['D'] = 2 / 13;
    average_durations['E'] = 3 / 13;
    average_durations['F'] = 2 / 13;
    average_durations['G'] = 1 / 13;
    average_durations['H'] = 1 / 13;
    average_durations['I'] = 1 / 13;
    average_durations['J'] = 1 / 13;



    // Create a new SVG element
    <!-- var svg_element = document.createElement('svg'); -->
    var svg_element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg_element.setAttribute('width', '1280');
    svg_element.setAttribute('height', '1024');

    // Insert SVG element after Button
    button_element = document.getElementById('button');
    button_element.parentNode.insertBefore(svg_element, button_element.nextSibling);

    // Cache a new set of coordinates
    var coordinates = {};

    // Draw AOIs
    for (var i = 0; i < aoi_data_csv.length; i++) {
        // Get attributes of current AOI
        var x = aoi_data_csv[i][0];
        var width = aoi_data_csv[i][1];
        var y = aoi_data_csv[i][2];
        var height = aoi_data_csv[i][3];
        var label = aoi_data_csv[i][4];

        var coordinate = {
            x: x,
            y: y,
            height: height,
            width: width,
            alias: label
        }

        coordinates[label] = coordinate;

        // Create an aoi element and set it's attributes
        var one_element_aoi = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        one_element_aoi.setAttribute('x', x);
        one_element_aoi.setAttribute('y', y);
        var color = colors[label];
        // var color = 'transparent';
        one_element_aoi.setAttribute('style', 'fill:' + color + ';stroke-width:2;stroke:rgb(0,0,0)')
        one_element_aoi.setAttribute('width', width);
        one_element_aoi.setAttribute('height', height);
        one_element_aoi.setAttribute('id', 'aoi-' + label);

        // Create text label and set label value
        var one_element_aoi_label = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        one_element_aoi_label.innerHTML = label;
        one_element_aoi_label.setAttribute('x', (+x) + (+width) - 20);
        one_element_aoi_label.setAttribute('y', (+y) + (+height) / 2 + 4);


        // Create a <g></g> tag to combile the AOI with the text label
        var one_element_aoi_combine = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        one_element_aoi_combine.appendChild(one_element_aoi);
        one_element_aoi_combine.appendChild(one_element_aoi_label);

        // Insert this AOI element into SVG element
        svg_element.appendChild(one_element_aoi_combine);
    }

    // Draw circles

    var element_path = document.getElementById('path');
    var data_path = element_path.value;

    // Convert AOI raw data to js array
    var data_path_csv = CSVToArray(data_path, ' ')[0];
    var indicator_X = {};
    var indicator_Y = {};

    // Initialize X and Y indicator for each AOI(each coordinate)
    var path_coordinates = {};
    var radius = 15;
    var padding = 3;

    for (var key in coordinates) {
        var value = coordinates[key];
        indicator_X[key] = coordinates[key]['x'] - radius;
        indicator_Y[key] = coordinates[key]['y'] - radius;
    }

    // Cache all circles
    circles = [];

    for (var i = 0; i < data_path_csv.length; i++) {
        var label = data_path_csv[i];
        var aoi_coordinate = coordinates[label];

        // calculate path coordinate
        var x = +indicator_X[label] + 2 * radius + padding;
        var y = +indicator_Y[label] + 2 * radius + padding;

        circles[i] = {
            x: x,
            y: y,
            label: label
        };

        if (+aoi_coordinate['width'] >= +aoi_coordinate['height']) {
            indicator_X[label] = x;
        } else {
            indicator_Y[label] = y;
        }


        // Now create circle element
        var circle_element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle_element.setAttribute('cx', x);
        circle_element.setAttribute('cy', y);
        circle_element.setAttribute('r', radius);
        circle_element.setAttribute('style', 'fill:transparent;stroke-width:2;stroke:rgb(0,0,0)');

        // create cirlce label
        var label_element = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        label_element.setAttribute('text-anchor', 'middle');
        label_element.setAttribute('x', x);
        label_element.setAttribute('y', y + 5);
        label_element.innerHTML = i;

        // create a combine element
        var combine_element = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        combine_element.appendChild(circle_element);
        combine_element.appendChild(label_element);

        svg_element.appendChild(combine_element);

    }

    // Draw lines
    for (var i = 0; i < circles.length - 1; i++) {
        var circle_1 = circles[i];
        var circle_2 = circles[i + 1];
        x1 = circle_1['x'];
        y1 = circle_1['y'];
        x2 = circle_2['x'];
        y2 = circle_2['y'];

        // Create a svg line element
        var line_element = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        line_element.setAttribute('x1', x1);
        line_element.setAttribute('y1', y1);
        line_element.setAttribute('x2', x2);
        line_element.setAttribute('y2', y2);
        line_element.setAttribute('style', 'stroke:rgb(255,0,0);stroke-width:2')

        svg_element.appendChild(line_element);

    }

    // Create a new V2 SVG element
    <!-- var svg_element_time = document.createElement('svg'); -->
    var svg_element_time = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var svg_element_time_width = 900;
    var svg_element_time_height = 600;
    var coordinate_system_padding = 50;

    svg_element_time.setAttribute('width', svg_element_time_width);
    svg_element_time.setAttribute('height', svg_element_time_height);

    // Insert SVG V2 element after Button
    // button_element.parentNode.insertBefore(svg_element_time, button_element.nextSibling);
    var h = document.getElementById('h');
    var d = document.getElementById('draggable')
    // d.setAttribute('id', 'draggable')
    d.appendChild(svg_element_time)
    h.appendChild(d);

    // Create a V2 svg X line element
    var line_time_X = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    line_time_X.setAttribute('x1', coordinate_system_padding);
    line_time_X.setAttribute('y1', svg_element_time_height - 2 * coordinate_system_padding);
    line_time_X.setAttribute('x2', svg_element_time_width - 2 * coordinate_system_padding);
    line_time_X.setAttribute('y2', svg_element_time_height - 2 * coordinate_system_padding);
    line_time_X.setAttribute('style', 'stroke:black;stroke-width:2');
    line_time_X.setAttribute('marker-end', 'url(#triangle)');
    svg_element_time.appendChild(line_time_X);

    // Create a V2 svg Y line element
    var line_time_Y = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    line_time_Y.setAttribute('x1', coordinate_system_padding);
    line_time_Y.setAttribute('y1', svg_element_time_height - 2 * coordinate_system_padding);
    line_time_Y.setAttribute('x2', coordinate_system_padding);
    line_time_Y.setAttribute('y2', coordinate_system_padding);
    line_time_Y.setAttribute('style', 'stroke:black;stroke-width:2');
    line_time_Y.setAttribute('marker-end', 'url(#triangle)');
    svg_element_time.appendChild(line_time_Y);

    // Create text label and set label value for Y axis

    var duplicates_indicator = {};
    var label_Ys = {}
    var circles_sorted = [];
    var circles_dic = {};

    for (var i = 0; i < circles.length; i++) {
        circles_sorted.push(circles[i]['label'])
        circles_dic[circles[i]['label']] = circles[i];
    }

    circles_sorted.sort();

    for (var i = 0, k = 0; i < circles_sorted.length; i++) {
        var label = circles_sorted[i];

        // remove duplicated labels
        if (!(label in duplicates_indicator)) {
            var linetime_aoi_label = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            linetime_aoi_label.innerHTML = label;
            linetime_aoi_label.setAttribute('x', 20);
            var label_y = svg_element_time_height - 2 * coordinate_system_padding - (k + 1) * 40;
            label_Ys[label] = label_y;
            linetime_aoi_label.setAttribute('y', label_y);
            svg_element_time.appendChild(linetime_aoi_label);
            k++;
            duplicates_indicator[label] = label;
        }
    }

    // Draw circles in coordinate system
    lines_in_coordinates = []
    for (var i = 0; i < circles.length; i++) {
        var one_element_time = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        var label = circles[i]['label'];
        var radius = 20;
        var x = coordinate_system_padding + radius * 2 + 60 * i;
        var y = label_Ys[label];
        width = 60;
        height = 15;
        one_element_time.setAttribute('cx', x);
        one_element_time.setAttribute('cy', y - 10);
        one_element_time.setAttribute('r', radius);
        one_element_time.setAttribute('style', 'fill:rgb(255,255,255);stroke-width:2;stroke:rgb(0,0,0)')
        one_element_time.setAttribute('width', width);
        one_element_time.setAttribute('height', height);
        one_element_time.setAttribute('onmouseover', 'mouse_on_aoi("' + label + '")');
        one_element_time.setAttribute('onmouseout', 'mouse_out_aoi("' + label + '")');

        // Cache the coordinates of current circle
        lines_in_coordinates.push({
            x: x,
            y: y - 10
        });
        svg_element_time.appendChild(one_element_time);
    }

    // Draw lines in coordinate system
    for (var i = 0; i < lines_in_coordinates.length - 1; i++) {
        var circle_1 = lines_in_coordinates[i];
        var circle_2 = lines_in_coordinates[i + 1];
        x1 = circle_1['x'];
        y1 = circle_1['y'];
        x2 = circle_2['x'];
        y2 = circle_2['y'];

        // Create a svg line element
        var line_element = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        line_element.setAttribute('x1', x1);
        line_element.setAttribute('y1', y1);
        line_element.setAttribute('x2', x2);
        line_element.setAttribute('y2', y2);
        line_element.setAttribute('style', 'stroke:rgb(255,0,0);stroke-width:2')

        svg_element_time.appendChild(line_element);


    }

    // Create a new V3 SVG element  - Bar chart
    var svg_element_bar = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var svg_element_time_width = 900;
    var svg_element_time_height = 600;
    var coordinate_system_padding = 50;

    svg_element_bar.setAttribute('width', svg_element_time_width);
    svg_element_bar.setAttribute('height', svg_element_time_height);

    // Insert SVG V3 element after Button
    button_element.parentNode.insertBefore(svg_element_bar, button_element.nextSibling);

    // Create a V3 svg X line element
    var line_time_X = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    line_time_X.setAttribute('x1', coordinate_system_padding);
    line_time_X.setAttribute('y1', svg_element_time_height - 2 * coordinate_system_padding);
    line_time_X.setAttribute('x2', svg_element_time_width - 2 * coordinate_system_padding);
    line_time_X.setAttribute('y2', svg_element_time_height - 2 * coordinate_system_padding);
    line_time_X.setAttribute('style', 'stroke:black;stroke-width:2');
    line_time_X.setAttribute('marker-end', 'url(#triangle)');
    svg_element_bar.appendChild(line_time_X);

    // Create a V3 svg Y line element
    var line_time_Y = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    line_time_Y.setAttribute('x1', coordinate_system_padding);
    line_time_Y.setAttribute('y1', svg_element_time_height - 2 * coordinate_system_padding);
    line_time_Y.setAttribute('x2', coordinate_system_padding);
    line_time_Y.setAttribute('y2', coordinate_system_padding);
    line_time_Y.setAttribute('style', 'stroke:black;stroke-width:2');
    line_time_Y.setAttribute('marker-end', 'url(#triangle)');
    svg_element_bar.appendChild(line_time_Y);

    // Create text label and set label value for X axis

    // Clear duplicated_indicator
    duplicates_indicator = {}
    for (var i = 0, k = 0; i < circles_sorted.length; i++) {
        var label = circles_sorted[i];

        // remove duplicated labels
        if (!(label in duplicates_indicator)) {
            var linetime_aoi_label = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            linetime_aoi_label.innerHTML = label;
            var x = coordinate_system_padding * (1.5 * k + 2);
            linetime_aoi_label.setAttribute('x', x);
            var label_y = svg_element_time_height - 2 * coordinate_system_padding - (k + 1) * 40;
            label_Ys[label] = label_y;
            var y = svg_element_time_height - 2 * coordinate_system_padding + 20;
            linetime_aoi_label.setAttribute('y', y);
            svg_element_bar.appendChild(linetime_aoi_label);
            k++;
            duplicates_indicator[label] = label;

            // draw rectangles

            var rx = x - coordinate_system_padding / 2;

            var X_y = svg_element_time_height - 2 * coordinate_system_padding;
            var h = average_durations[label] * 2 * X_y;
            var ry = X_y - h;

            var width = 1 * coordinate_system_padding;
            var height = h;



            var e_rec = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            e_rec.setAttribute('x', rx);
            e_rec.setAttribute('y', ry);
            e_rec.setAttribute('width', width);
            e_rec.setAttribute('height', height);
            var c = colors[label];
            e_rec.setAttribute('style', 'fill:' + c + ';stroke-width:2;stroke:rgb(0,0,0)')
            svg_element_bar.appendChild(e_rec);
        }
    }
}

function mouse_on_aoi(label) {
    var target_element = document.getElementById('aoi-' + label);
    target_element.setAttribute('style', 'fill:rgb(255,100,255);stroke-width:2;stroke:rgb(0,0,0)')

}

function mouse_out_aoi(label) {
    var target_element = document.getElementById('aoi-' + label);
    var color = colors[label];
    target_element.setAttribute('style', 'fill:' + color + ';stroke-width:2;stroke:rgb(0,0,0)')
}
