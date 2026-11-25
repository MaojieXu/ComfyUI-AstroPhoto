---
name: astrophoto-management
description: Manage the local AstroPhoto library, equipment and optical trains, and project folders and asset references. Use for importing, finding, organizing, updating, archiving, or removing AstroPhoto records and for managing calibration links.
---

# AstroPhoto management

Use the AstroPhoto MCP tools for operations on the selected ComfyUI instance. Call `list_tool_categories`, then `list_category_tools` for the relevant category. Invoke a discovered business tool using `call_tool` with its name and arguments; references below name those business tools. When the target is unclear or a connection fails, use `connection_status`. If several instances are available, show the candidates and use `connection_select` after the user identifies the intended library.

Resolve records using the names returned by search tools. Use the exact returned name for subsequent operations, and continue with `next_cursor` and the same filters when a list is paginated. Ask which record or action the user means when the request is ambiguous. For updates, send only the fields the user intends to change. Use null only for fields the tool schema allows clearing.

## Library and calibration

- Use `library_list` to find assets and `library_get` to read details. Use `library_list_subframes` for individual files in a collection.
- For imports, use `library_import` with absolute paths on the ComfyUI host. Use `library_inspect_folder` if you need to see a specified folder's eligible files. Import multiple subframes as one collection. Videos, image results, and master frames each take a single file. Use `library_add_subframes` to append to an existing collection.
- An import submission returns a task number. Use `library_import_status` with that number and report the actual registered, copied, skipped, or failed counts once available. If still running, report the task number and its current status. Query an existing task before considering another submission after an uncertain result.
- Use `library_find_calibration` to compare master frames for a collection. Explain meaningful mismatches or unknown values when choosing a master. Use `library_bind_calibration` or `library_unbind_calibration`, then read the collection to verify the resulting bindings.
- Use `library_update` for metadata changes. Use `library_remove` to unregister an asset and `library_remove_subframe` to unregister one collection member. Unregistration preserves the physical files and clears affected project references and calibration bindings.
- Use `storage_delete_managed_file` only for an explicit request to delete a managed file. For a subframe, use the registered path returned by `library_list_subframes`. This operation can delete an AstroPhoto-managed copy in an external workspace, preserves external reference originals, and leaves the catalog registration. Clarify whether a vague request to “delete” means unregistering or physical deletion.

## Equipment and optical trains

- Use `equipment_list` and `equipment_get` to find devices, and `optical_train_list` and `optical_train_get` for groups. Check the archived list when resolving a request to restore a record.
- Use `equipment_create` or `equipment_update` for device records. Use `optical_train_create` or `optical_train_update` with exact existing equipment names. Match members to their device types. For group updates, null clears a single member and an empty list clears a list of members.
- Use `equipment_set_archived` or `optical_train_set_archived` for archive or restore requests. Use `equipment_delete` or `optical_train_delete` for explicit deletion requests. Device deletion detaches live references while preserving historical snapshots. Deleted groups disappear from new binding choices; existing assets retain historical equipment information.

## Projects

- Use `project_list` and `project_get` to locate the project and destination. Project paths are logical paths such as `/Raw/Lights`; they represent folders within the project. Use `project_create`, `project_update`, and `project_create_folders` to manage project structure.
- Resolve each asset in the library before calling `project_add_assets` with the project name, folder path, and asset names. Use `project_update_node` to rename or move a node.
- Use `project_remove_node` for a folder or reference and `project_delete` for the whole project. Project deletion removes project structure and references while preserving the library records and disk files. Use `project_impact` when the user asks what a removal would affect.

Read back the relevant asset, device, group, or project after a change. For removals, verify absence in the corresponding list or lookup. Report the target and what the tool confirmed, including any unresolved or partial outcomes.
