;; Pharmacy Verification Contract
;; Manages verification and registration of senior care pharmacies

(define-map verified-pharmacies
  { pharmacy-id: uint }
  {
    name: (string-ascii 100),
    license-number: (string-ascii 50),
    address: (string-ascii 200),
    verified: bool,
    verification-date: uint
  }
)

(define-map pharmacy-admins
  { admin: principal }
  { authorized: bool }
)

(define-data-var contract-owner principal tx-sender)
(define-data-var next-pharmacy-id uint u1)

;; Error constants
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-PHARMACY-NOT-FOUND (err u101))
(define-constant ERR-ALREADY-VERIFIED (err u102))

;; Initialize contract owner as admin
(map-set pharmacy-admins { admin: tx-sender } { authorized: true })

;; Register a new pharmacy
(define-public (register-pharmacy (name (string-ascii 100)) (license-number (string-ascii 50)) (address (string-ascii 200)))
  (let ((pharmacy-id (var-get next-pharmacy-id)))
    (map-set verified-pharmacies
      { pharmacy-id: pharmacy-id }
      {
        name: name,
        license-number: license-number,
        address: address,
        verified: false,
        verification-date: u0
      }
    )
    (var-set next-pharmacy-id (+ pharmacy-id u1))
    (ok pharmacy-id)
  )
)

;; Verify a pharmacy (admin only)
(define-public (verify-pharmacy (pharmacy-id uint))
  (begin
    (asserts! (is-admin tx-sender) ERR-NOT-AUTHORIZED)
    (match (map-get? verified-pharmacies { pharmacy-id: pharmacy-id })
      pharmacy-data
      (begin
        (asserts! (not (get verified pharmacy-data)) ERR-ALREADY-VERIFIED)
        (map-set verified-pharmacies
          { pharmacy-id: pharmacy-id }
          (merge pharmacy-data { verified: true, verification-date: block-height })
        )
        (ok true)
      )
      ERR-PHARMACY-NOT-FOUND
    )
  )
)

;; Check if pharmacy is verified
(define-read-only (is-pharmacy-verified (pharmacy-id uint))
  (match (map-get? verified-pharmacies { pharmacy-id: pharmacy-id })
    pharmacy-data (get verified pharmacy-data)
    false
  )
)

;; Get pharmacy details
(define-read-only (get-pharmacy (pharmacy-id uint))
  (map-get? verified-pharmacies { pharmacy-id: pharmacy-id })
)

;; Check if user is admin
(define-read-only (is-admin (user principal))
  (default-to false (get authorized (map-get? pharmacy-admins { admin: user })))
)

;; Add admin (owner only)
(define-public (add-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (map-set pharmacy-admins { admin: new-admin } { authorized: true })
    (ok true)
  )
)
