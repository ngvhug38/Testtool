# Testtool

## Vendored: PPT Master skill

`vendor/ppt-master/` is an unmodified copy of the `skills/ppt-master` folder
from [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master)
(MIT, Copyright (c) 2025-2026 Hugo He; see `vendor/ppt-master/LICENSE`).

- Upstream commit: `63a03673d5c3c928e7f52983a2c8ec65bac30002`
- Skill version: 6.10.0

Do not edit files in that folder. The skill's integrity check
(`scripts/attribution_guard.py`) refuses to run if its attribution files or
gate scripts have been changed.

### Setup

```bash
pip install -r vendor/ppt-master/requirements.txt
```

To let Claude Code load it as a skill, copy or symlink it into a skills
directory, for example:

```bash
mkdir -p .claude/skills && ln -s ../../vendor/ppt-master .claude/skills/ppt-master
```

Then ask, for example, "Create a PPT from projects/my-deck/sources/report.pdf".

### Updating

```bash
git clone --depth 1 https://github.com/hugohe3/ppt-master /tmp/ppt-master
rm -rf vendor/ppt-master
cp -a /tmp/ppt-master/skills/ppt-master vendor/ppt-master
```

Then update the upstream commit listed above.
