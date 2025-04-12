import { Card, Progress, Space, Typography, Row, Col } from "antd";
import { Event } from "nostr-tools";
import { useEffect } from "react";
import { useAppContext } from "../../hooks/useAppContext/useAppContext";
import OverlappingAvatars from "../../components/Common/OverlappingAvatars";
import { TextWithImages } from "../../components/Common/TextWithImages";

const { Text } = Typography;

interface AnalyticsProps {
  pollEvent: Event;
  responses: Event[];
}

export const Analytics: React.FC<AnalyticsProps> = ({
  pollEvent,
  responses,
}) => {
  const label =
    pollEvent.tags.find((t) => t[0] === "label")?.[1] || pollEvent.content;
  const options = pollEvent.tags.filter((t) => t[0] === "option");

  const { profiles, fetchUserProfileThrottled } = useAppContext();

  useEffect(() => {
    responses.forEach((event) => {
      const responderId = event.pubkey;
      if (!profiles?.get(responderId)) {
        fetchUserProfileThrottled(responderId);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateResults = () => {
    const results: { count: number; responders: Set<string> }[] = options.map(
      () => ({ count: 0, responders: new Set<string>() })
    );
    // Count responses from events
    responses.forEach((event) => {
      const responderId = event.pubkey;
      event.tags.forEach((tag: string[]) => {
        if (tag[0] === "response") {
          const optionId = tag[1];
          const responseIndex = options.findIndex(
            (optionTag) => optionTag[1] === optionId
          );
          if (responseIndex !== -1) {
            if (!results[responseIndex].responders.has(responderId)) {
              results[responseIndex].count++;
              results[responseIndex].responders.add(responderId);
            }
          }
        }
      });
    });
    return results;
  };
  
  const results = calculateResults();
  const totalVotes = results.reduce((acc, result) => acc + result.count, 0);

  // Function to determine progress bar color based on percentage
  const getProgressColor = (percentage: number) => {
    if (percentage < 20) return "#f5222d"; // Red for low percentages
    if (percentage < 40) return "#fa8c16"; // Orange for below average
    if (percentage < 60) return "#faad14"; // Yellow for average
    if (percentage < 80) return "#a0d911"; // Light green for above average
    return "#52c41a"; // Green for high percentages
  };

  return (
    <Card 
      title={label} 
      className="poll-analytics-card"
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {options.map((option, index) => {
          const responders = Array.from(results[index].responders);
          const count = results[index].count;
          const percentage = totalVotes > 0 
            ? parseFloat(((count / totalVotes) * 100).toFixed(2)) 
            : 0;
          const barColor = getProgressColor(percentage);
            
          return (
            <div key={index} className="poll-option">
              <div className="poll-option-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text strong><TextWithImages content={option[2]} /></Text>
                <Text>{count} votes</Text>
              </div>
              
              <Row gutter={16} align="middle">
                <Col span={18}>
                  <Progress 
                    percent={percentage} 
                    status="active" 
                    strokeColor={barColor}
                    format={(percent) => `${percent}%`}
                  />
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                  <OverlappingAvatars ids={responders} maxAvatars={3} />
                </Col>
              </Row>
            </div>
          );
        })}
        
        {totalVotes === 0 && (
          <Text type="secondary">No votes recorded yet</Text>
        )}
      </Space>
    </Card>
  );
};