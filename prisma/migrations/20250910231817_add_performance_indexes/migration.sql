-- CreateIndex
CREATE INDEX "ProviderProfile_serviceType_idx" ON "ProviderProfile"("serviceType");

-- CreateIndex
CREATE INDEX "ProviderProfile_serviceType_createdAt_idx" ON "ProviderProfile"("serviceType", "createdAt");

-- CreateIndex
CREATE INDEX "ProviderProfile_experience_idx" ON "ProviderProfile"("experience");
