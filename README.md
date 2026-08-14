# QuickShift — Payload CMS Hero Pages

## Run it

```bash
npm install
cp .env.example .env          # then edit PAYLOAD_SECRET to a random string
npm run dev
```

Open http://localhost:3000/admin to create your first admin user.

## Add the two existing routes (Delhi→Bangalore, Delhi→Mumbai)

```bash
npm run seed
```

Then visit:
- http://localhost:3000/shipping-rates-from-delhi-to-bangalore
- http://localhost:3000/shipping-rates-from-delhi-to-mumbai

## Add a new city-pair page

In /admin → Shipping Route Pages → Create New, fill in origin/destination city,
starting price, and delivery days — the H1, subhead, and checklist are generated
automatically. No code changes needed.

## Notes

- Uses SQLite (`quickship.db`, created automatically) so there's nothing extra
  to install to try it locally. Swap `@payloadcms/db-sqlite` for
  `@payloadcms/db-postgres` or `@payloadcms/db-mongodb` in `src/payload.config.ts`
  for production.
- `public/assets/` contains your original CSS and image/icon assets, copied
  as-is from the uploaded archive.
- Leads submitted through the Hero form are stored in the `leads` collection,
  viewable in /admin.
