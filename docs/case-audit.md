# Case accuracy audit

Reviewed 2026-11-04: all 62 standard email cases, six suspicious messages, and
13 walk-in cases with 31 repair stages, including their component findings and
Extreme telemetry. The scripted projector incident has stage-specific display
copy explaining the same three existing fixes.

## Standard for a correct answer

A case needs enough stated evidence for its best next action. A symptom alone
does not establish a diagnosis. These are short, authored simulations with
pre-established findings, not a substitute for a real organization's runbooks.

The timed engine, ticket order, fix IDs, and repair sequences were not changed.
Complaint text, observation text, and UI labels now make those existing actions
technically defensible. The internal `password` action is presented as **Recover
access**, encompassing the explicitly stated, approved recovery workflow.

| Area | Correction and rationale |
| --- | --- |
| Lost authentication device | Explicitly calls for approved MFA recovery after identity verification. A password reset alone does not replace a lost authenticator. |
| Account lock and exposed credentials | Requires identity verification and approved recovery. The exposed-password case includes replacing the credential and revoking sessions. No automatic or unverified resets are taught. |
| Password expiration | The remaining expiration example is identified as a legacy application requirement. Routine forced rotation is not presented as modern general guidance. |
| Printer faults | A restart addresses a confirmed stuck print service with a clear paper path. A driver update addresses a confirmed driver defect after a successful hardware self-test. Physical paper jams are no longer mislabeled as restart problems. |
| Display faults | Loose or failed signal cables support connection repair. Screen rotation is no longer mislabeled as a cable problem. Later steps identify the specific stuck receiver or confirmed driver defect. |
| Restarting equipment | Work is saved, maintenance is authorized, or an approved recovery procedure explicitly calls for the restart. Lab servers have no active production traffic or jobs. |
| Power faults | Evidence specifies an unplugged, approved supply with no heat or damage. Cosmetic flames and smoke are suppressed on held devices so the art does not contradict safe connection cases. |
| Software updates | Trusted management channels, a verified release, and an applicable defect or unsupported version are explicit. Pop-ups alone are not authority to install software. |
| Suspicious messages | The existing `notit` fix is labeled **Route / report**. The UI says report for review, avoid links and attachments, and verify through a known channel. Suspicion is not represented as proof of compromise. |
| Non-IT requests | Cases identify the responsible office, facilities, or scheduling contact, so routing is helpful rather than dismissive. |
| Multi-step repairs | Each newly visible issue has its own evidence. Installing a driver or restoring access does not universally require a restart; these authored cases state the applicable installer or recovery requirement. |

## Primary references

- [NIST SP 800-63B-4: Authentication and Authenticator Management](https://pages.nist.gov/800-63-4/sp800-63b.html)
  informs the distinction between passwords, authenticators, recovery, and
  identity checks, and the avoidance of arbitrary periodic password changes.
- [CISA: Four Easy Ways to Stay Safe Online](https://www.cisa.gov/sites/default/files/2024-09/Secure-Our-World-4-Easy-Ways-Stay-Safe-Online-Tip-Sheet.pdf)
  supports reporting suspicious messages and using trusted software updates.
- [FTC: How to Recognize and Avoid Phishing Scams](https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams)
  supports independent verification through known contact information.
- [Printer paper-jam troubleshooting](https://support.microsoft.com/en-us/windows/hardware/printer/fix-printer-stopped-due-to-paper-jam-errors-in-windows)
  distinguishes a physical paper obstruction from a software-service fault.
- [Display resolution and orientation](https://support.microsoft.com/en-au/windows/hardware/display-graphics/change-your-screen-resolution-and-layout-in-windows)
  separates display orientation settings from connection faults.
- [External monitor connection troubleshooting](https://support.microsoft.com/en-us/windows/hardware/display-graphics/troubleshoot-external-monitor-connections-in-windows)
  supports inspecting physical connections and using fault-specific diagnostics.

These references support the underlying principles. They do not certify the
fictional devices or imply that every possible real-world cause has been modeled.

## Regression coverage

Tests require access cases to state identity verification, updates to specify
approved or verified sources, the lost-device case to name MFA recovery, and
every walk-in stage to map to its authored next fix. Browser checks exercised
all six devices, stage changes, wrong answers, completion, and expiration.
