"use strict";

// The custom field is registered with `type: "string"` (so the column is
// searchable/orderable in Strapi). The admin Input serializes tags as a JSON
// string before save, so by the time webhooks fire the field is a stringified
// array. This bootstrap patches `webhookRunner.run` once at startup to
// JSON-parse those fields back into `[{name}]` arrays before the HTTP request
// leaves Strapi — so consumers receive structured data, not an opaque string.

const CUSTOM_FIELD = "plugin::tagsinput.tags";

const parse = (v) => {
  if (typeof v !== "string") return v;
  try {
    const out = JSON.parse(v);
    return Array.isArray(out) ? out : v;
  } catch {
    return v;
  }
};

const collectFields = (strapi) => {
  const map = new Map();
  for (const [uid, ct] of Object.entries(strapi.contentTypes || {})) {
    const fields = Object.entries(ct?.attributes || {})
      .filter(([, attr]) => attr?.customField === CUSTOM_FIELD)
      .map(([name]) => name);
    if (fields.length) map.set(uid, fields);
  }
  return map;
};

module.exports = ({ strapi }) => {
  let runner;
  try {
    runner = strapi.get("webhookRunner");
  } catch {
    return;
  }
  if (runner.__tagsinputPatched) return;

  const fieldsByUid = collectFields(strapi);
  if (fieldsByUid.size === 0) return;

  const original = runner.run.bind(runner);
  runner.run = (webhook, event, info = {}) => {
    const fields = fieldsByUid.get(info && info.uid);
    if (fields && info.entry && typeof info.entry === "object") {
      const entry = { ...info.entry };
      for (const f of fields) if (f in entry) entry[f] = parse(entry[f]);
      info = { ...info, entry };
    }
    return original(webhook, event, info);
  };

  runner.__tagsinputPatched = true;
};
