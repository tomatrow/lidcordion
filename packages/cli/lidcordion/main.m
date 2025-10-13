//
//  main.m
//  lidcordion
//
//  Created by AJ Caldwell on 10/12/25.
//

#import <Foundation/Foundation.h>
#import <math.h>
#import "LidAngleSensor.h"

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        LidAngleSensor *sensor = [[LidAngleSensor alloc] init];
        
        if (!sensor.isAvailable) {
            fprintf(stderr, "Error: Lid angle sensor not available on this device\n");
            return 1;
        }
        
        double lastAngle = -999.0;
        const double changeThreshold = 0.1;
        
        while (true) {
            double currentAngle = [sensor lidAngle];
            
            if (currentAngle == -2.0) {
                fprintf(stderr, "Error reading sensor\n");
            } else if (fabs(currentAngle - lastAngle) >= changeThreshold) {
                printf("%.0f\n", currentAngle);
                lastAngle = currentAngle;
            }
            
            // Poll every 16.67ms (60 Hz)                                                                             
			usleep(1000000 / 60);
        }
    }

    return 0;
}
