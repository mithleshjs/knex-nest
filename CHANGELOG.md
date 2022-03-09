# Changelog

## v2.0.0 (10/Mar/2022)

`Breaking Changes`

### Added

- `configTag` option in KnexModule `option`
- support for multiple database connections
- cursor based pagination

### Changed

- rewrite pagination as a separate utility instead of knex plugin

### Removed

- `enablePaginator` option from KnexModule `option`
- pagination plugin by [felixmosh](https://github.com/felixmosh/knex-paginate)

---
  
## v1.0.2 (20/Oct/2021)

### Fixed

- [c4be6d1](https://github.com/mithleshjs/knex-nest/commit/c4be6d10815d604340d0150963fdafad3d2f013a) incorrect syntax in peer dependencies
