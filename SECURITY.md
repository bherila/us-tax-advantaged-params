# Security Policy

## Supported versions

Until a stable 1.0 release, security and correctness fixes are applied to the latest published minor release. Older pre-1.0 versions may not receive backports.

| Version | Supported |
|---|---:|
| Latest 0.x release | Yes |
| Earlier 0.x releases | Best effort |

## Reporting a vulnerability

Do not disclose a vulnerability publicly before the maintainer has had a reasonable opportunity to investigate and release a fix.

Use GitHub private vulnerability reporting for the repository when available. If that channel is unavailable, use the private maintainer contact shown on the npm or Packagist package page.

Include the affected version and runtime, a minimal reproducer, expected and actual behavior, security impact, whether the issue is already public, and any proposed remediation.

## Tax-calculation correctness reports

A tax-calculation defect may not be a software-security vulnerability, but it can still be high impact. Report material calculation errors privately when premature disclosure could cause users to rely on a known incorrect result. Include the tax year, account type, inputs, output, expected result, and primary authority.

## Security model

The calculation engines are dependency-free and do not perform network, filesystem, subprocess, or dynamic-code operations during ordinary calculations. Build and release scripts do use local development tools and should be run only from a trusted checkout.
