#!/usr/bin/env node
import { rm } from "node:fs/promises";

await rm(new URL("../dist-tests", import.meta.url), { recursive: true, force: true });
