import { describe, it, expect, beforeEach } from "vitest"

// Mock contract state
const mockAdherenceContract = {
  adherenceRecords: new Map(),
  adherenceStats: new Map(),
  nextRecordId: 1,
}

function scheduleDose(patientId: number, medicationId: number, scheduledTime: number) {
  const recordId = mockAdherenceContract.nextRecordId++
  mockAdherenceContract.adherenceRecords.set(recordId, {
    patientId,
    medicationId,
    scheduledTime,
    takenTime: null,
    taken: false,
    notes: "",
  })
  return { success: true, value: recordId }
}

function markDoseTaken(recordId: number, notes: string) {
  const record = mockAdherenceContract.adherenceRecords.get(recordId)
  if (!record) {
    return { success: false, error: "ERR-RECORD-NOT-FOUND" }
  }
  
  if (record.taken) {
    return { success: false, error: "ERR-ALREADY-TAKEN" }
  }
  
  record.taken = true
  record.takenTime = Date.now()
  record.notes = notes
  
  updateAdherenceStats(record.patientId, record.medicationId, true)
  return { success: true, value: true }
}

function markDoseMissed(recordId: number, notes: string) {
  const record = mockAdherenceContract.adherenceRecords.get(recordId)
  if (!record) {
    return { success: false, error: "ERR-RECORD-NOT-FOUND" }
  }
  
  record.notes = notes
  updateAdherenceStats(record.patientId, record.medicationId, false)
  return { success: true, value: true }
}

function updateAdherenceStats(patientId: number, medicationId: number, taken: boolean) {
  const key = `${patientId}-${medicationId}`
  const currentStats = mockAdherenceContract.adherenceStats.get(key) || {
    totalDoses: 0,
    takenDoses: 0,
    missedDoses: 0,
    adherenceRate: 0,
  }
  
  currentStats.totalDoses += 1
  if (taken) {
    currentStats.takenDoses += 1
  } else {
    currentStats.missedDoses += 1
  }
  
  currentStats.adherenceRate =
      currentStats.totalDoses > 0 ? Math.round((currentStats.takenDoses / currentStats.totalDoses) * 100) : 0
  
  mockAdherenceContract.adherenceStats.set(key, currentStats)
}

function getAdherenceStats(patientId: number, medicationId: number) {
  const key = `${patientId}-${medicationId}`
  return mockAdherenceContract.adherenceStats.get(key) || null
}

describe("Adherence Monitoring Contract", () => {
  beforeEach(() => {
    mockAdherenceContract.adherenceRecords.clear()
    mockAdherenceContract.adherenceStats.clear()
    mockAdherenceContract.nextRecordId = 1
  })
  
  it("should schedule a dose", () => {
    const result = scheduleDose(1, 1, 1000)
    
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
    
    const record = mockAdherenceContract.adherenceRecords.get(1)
    expect(record?.patientId).toBe(1)
    expect(record?.medicationId).toBe(1)
    expect(record?.taken).toBe(false)
  })
  
  it("should mark dose as taken", () => {
    scheduleDose(1, 1, 1000)
    
    const result = markDoseTaken(1, "Taken with breakfast")
    
    expect(result.success).toBe(true)
    
    const record = mockAdherenceContract.adherenceRecords.get(1)
    expect(record?.taken).toBe(true)
    expect(record?.notes).toBe("Taken with breakfast")
  })
  
  it("should not allow marking already taken dose", () => {
    scheduleDose(1, 1, 1000)
    markDoseTaken(1, "First time")
    
    const result = markDoseTaken(1, "Second time")
    
    expect(result.success).toBe(false)
    expect(result.error).toBe("ERR-ALREADY-TAKEN")
  })
  
  it("should mark dose as missed", () => {
    scheduleDose(1, 1, 1000)
    
    const result = markDoseMissed(1, "Patient forgot")
    
    expect(result.success).toBe(true)
    
    const record = mockAdherenceContract.adherenceRecords.get(1)
    expect(record?.taken).toBe(false)
    expect(record?.notes).toBe("Patient forgot")
  })
  
  it("should calculate adherence statistics correctly", () => {
    // Schedule and take 3 doses
    scheduleDose(1, 1, 1000)
    scheduleDose(1, 1, 2000)
    scheduleDose(1, 1, 3000)
    
    markDoseTaken(1, "Taken")
    markDoseTaken(2, "Taken")
    markDoseMissed(3, "Missed")
    
    const stats = getAdherenceStats(1, 1)
    
    expect(stats?.totalDoses).toBe(3)
    expect(stats?.takenDoses).toBe(2)
    expect(stats?.missedDoses).toBe(1)
    expect(stats?.adherenceRate).toBe(67) // 2/3 * 100 rounded
  })
  
  it("should return null for non-existent adherence stats", () => {
    const stats = getAdherenceStats(999, 999)
    expect(stats).toBeNull()
  })
})
