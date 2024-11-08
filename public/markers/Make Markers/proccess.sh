#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 <working_path>"
    exit 1
fi

working_path="$1"
input_dir="$working_path/in"
output_base_dir="$working_path/out"
templates_dir="$working_path/template"

if [ ! -d "$input_dir" ]; then
    echo "Input directory $input_dir does not exist."
    exit 1
fi

if [ ! -d "$templates_dir" ]; then
    echo "Template directory $templates_dir does not exist."
    exit 1
fi

template_count=$(find "$templates_dir" -type f | wc -l)

overlay_size="45x45"

for input_image in "$input_dir"/*; do
    if [[ ! "$input_image" =~ \.(jpg|jpeg|png|gif)$ ]]; then
        echo "Skipping non-image file $input_image"
        continue
    fi
    
    image_name=$(basename "$input_image" | sed 's/\.[^.]*$//')
    
    if [ "$template_count" -eq 1 ]; then
        output_dir="$output_base_dir"
        mkdir -p "$output_dir"
    else
        output_dir="$output_base_dir/$image_name"
        mkdir -p "$output_dir"
    fi
    
    for template in "$templates_dir"/*; do
        template_name=$(basename "$template" | sed 's/\.[^.]*$//')
        
        if [ "$template_count" -eq 1 ]; then
            output_image="$output_dir/${image_name}.png"
        else
            output_image="$output_dir/${template_name}.png"
        fi
        
        magick "$template" \( "$input_image" -resize "$overlay_size" \) -gravity center -composite "$output_image"
        
        echo "Created $output_image"
    done
done

echo "Overlay process completed for all images in $input_dir!"
