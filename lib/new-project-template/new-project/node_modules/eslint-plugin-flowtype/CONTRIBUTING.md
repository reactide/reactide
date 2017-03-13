# Updating documentation

[./README.md](./README.md) is a generated file. The source of the file is [./.README/README.md](/.README/README.md).

## To make a change to the documentation:

1. Update [./.README/README.md](/.README/README.md)

A CI service will build and publish the new documentation.

## To add documentation for a rule:

1. Create new file in `./README/rules/[rule-name].md`.
  * Use [./.README/rules/require-valid-file-annotation.md](./.README/rules/require-valid-file-annotation.md) as a template.
  * Ensure that rule documentation document includes `<!-- assertions spaceAfterTypeColon -->` declaration.
1. Update [./.README/README.md](/.README/README.md) to include the new rule.

A CI service will build and publish the new documentation.

Note: The section "The following patterns are considered problems:" and "The following patterns are not considered problems:" is generated using the test cases.
