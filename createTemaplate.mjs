export function createTemaplate(dockerId) {
  return `{
  "machine": {
      "gpu": 1,
      "cpu": 1000,
      "ram": 8000
  },
  "job": {
      "APIVersion": "V1beta1",
      "Metadata": {
          "CreatedAt": "0001-01-01T00:00:00Z",
          "Requester": {}
      },
      "Spec": {
          "Deal": {
              "Concurrency": 1
          },
          "Docker": {},
          "EngineSpec": {
              "Params": {
              "Entrypoint": null,
              "EnvironmentVariables": [
                  {{ if .Prompt }}"{{ subst "PROMPT=%s" .Prompt }}",{{ end }}
                  {{ if .Seed }}"{{ subst "SEED=%s" .Seed }}",{{ end }}
                  {{ if .Steps }}"{{ subst "STEPS=%s" .Steps }}",{{ end }}
                  {{ if .Sampler }}"{{ subst "SAMPLER=%s" .Sampler }}",{{ end }}
                  {{ if .Scheduler }}"{{ subst "SCHEDULER=%s" .Scheduler }}",{{ end }}
                  {{ if .Size }}"{{ subst "SIZE=%s" .Size }}",{{ end }}
                  {{ if .Batching }}"{{ subst "BATCHING=%s" .Batching }}",{{ end }}
                  "HF_HUB_OFFLINE=1"
              ],
              "Image": "${dockerId}",
              "Parameters": [
              ],
              "WorkingDirectory": ""
              },
              "Type": "docker"
          },
          "Network": {
              "Type": "None"
          },
          "Outputs": [
              {
              "Name": "outputs",
              "Path": "/outputs"
              }
          ],
          "PublisherSpec": {
              "Type": "ipfs"
          },
          "Resources": {
              "GPU": "1"
          },
          "Timeout": 1800,
          "Wasm": {
              "EntryModule": {}
          }
      }
  }
}`;
}
