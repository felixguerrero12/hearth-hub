import { Hunt } from './types';

export const mockHunts: Hunt[] = [
    {
        id: "M002",
        tactic: "Command and Control",
        hypothesis: "Beaconing behavior can be detected in encrypted DNS traffic patterns by applying machine learning models that identify anomalous, periodic communication indicative of command and control activity.",
        notes: "Encrypted DNS traffic (e.g., DoH) may be used to hide beaconing communications, making it harder to detect.",
        tags: ["commandandcontrol", "beaconing", "dns", "machinelearning"],
        submitter: {
            name: "Sydney Marrone",
            link: "https://x.com/letswastetime"
        },
        content: `## Why\n\n- Detect hidden beaconing activities by analyzing patterns in encrypted DNS traffic that deviate from typical usage.\n- Apply machine learning models to identify anomalies in encrypted DNS traffic, such as regular, periodic connections that suggest beaconing.\n- Enhance detection capabilities for encrypted communications channels that attackers may exploit to hide their C2 activities.\n\n## References\n\n- https://attack.mitre.org/techniques/T1071/004/\n- https://unit42.paloaltonetworks.com/profiling-detecting-malicious-dns-traffic/\n- https://suleman-qutb.medium.com/using-machine-learning-for-dns-exfiltration-tunnel-detection-418376b555fa`
    }
];
