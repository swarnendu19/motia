#!/bin/bash

copy_templates() {
    local src_dir="$1"
    local dest_dir="$2"

    # Create the destination directory if it doesn't exist
    mkdir -p "$dest_dir"

    # Copy all non folder files while preserving the directory structure
    find -L "$src_dir" -type f | while read -r file; do
        # Get the relative path of the file
        rel_path="${file#$src_dir/}"
        # Create the destination directory for the file
        mkdir -p "$dest_dir/$(dirname "$rel_path")"
        # Copy the file to the destination directory
        cp "$file" "$dest_dir/$rel_path"
    done

    echo "All files from $src_dir have been copied successfully to $dest_dir."
}

# Define source and destination directories
CREATE_TEMPLATES_SRC_DIR="$(dirname "$0")/../src/create/templates"

# Copy templates to CJS directory
CREATE_TEMPLATES_DEST_DIR="$(dirname "$0")/../dist/cjs/create/templates"
copy_templates "$CREATE_TEMPLATES_SRC_DIR" "$CREATE_TEMPLATES_DEST_DIR"


# Copy templates to ESM directory
CREATE_TEMPLATES_DEST_DIR="$(dirname "$0")/../dist/esm/create/templates"
copy_templates "$CREATE_TEMPLATES_SRC_DIR" "$CREATE_TEMPLATES_DEST_DIR"

CREATE_STEP_TEMPLATES_SRC_DIR="$(dirname "$0")/../src/create-step/templates"

# Copy step templates to CJS directory
CREATE_STEP_TEMPLATES_DEST_DIR="$(dirname "$0")/../dist/cjs/create-step/templates"
copy_templates "$CREATE_STEP_TEMPLATES_SRC_DIR" "$CREATE_STEP_TEMPLATES_DEST_DIR"

# Copy step templates to ESM directory
CREATE_STEP_TEMPLATES_DEST_DIR="$(dirname "$0")/../dist/esm/create-step/templates"
copy_templates "$CREATE_STEP_TEMPLATES_SRC_DIR" "$CREATE_STEP_TEMPLATES_DEST_DIR"

# Copy docker templates
DOCKER_TEMPLATES_SRC_DIR="$(dirname "$0")/../src/docker/templates"
DOCKER_TEMPLATES_CJS_DEST_DIR="$(dirname "$0")/../dist/cjs/docker/templates"
DOCKER_TEMPLATES_ESM_DEST_DIR="$(dirname "$0")/../dist/esm/docker/templates"

copy_templates "$DOCKER_TEMPLATES_SRC_DIR" "$DOCKER_TEMPLATES_CJS_DEST_DIR"
copy_templates "$DOCKER_TEMPLATES_SRC_DIR" "$DOCKER_TEMPLATES_ESM_DEST_DIR"
